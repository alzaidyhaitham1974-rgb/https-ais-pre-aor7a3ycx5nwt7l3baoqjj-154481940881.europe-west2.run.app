/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, SubjectKey, SubjectGrades } from './types';

/**
 * Calculates a standard average safely, ignoring undefined/null values
 */
export function safeAvg(val1?: number, val2?: number): number | undefined {
  if (val1 === undefined && val2 === undefined) return undefined;
  const count = (val1 !== undefined ? 1 : 0) + (val2 !== undefined ? 1 : 0);
  const sum = (val1 ?? 0) + (val2 ?? 0);
  return count > 0 ? Math.round(sum / count) : undefined;
}

/**
 * Calculates Year Endeavor (السعي السنوي)
 * السعي السنوي (يجمع درجات (معدل الفصل الاول ونصف السنة ومعدل الفصل الثاني) وتقسم على 3)
 */
export function calculateEndeavor(avg1?: number, midyear?: number, avg2?: number): number | undefined {
  const parts: number[] = [];
  if (avg1 !== undefined) parts.push(avg1);
  if (midyear !== undefined) parts.push(midyear);
  if (avg2 !== undefined) parts.push(avg2);
  
  if (parts.length === 0) return undefined;
  const sum = parts.reduce((a, b) => a + b, 0);
  return Math.round(sum / parts.length);
}

/**
 * Calculates active service counter for teachers/staff from their start date to today
 * تاريخ المباشرة -> الخدمة الفعلية (انشاء عداد لحساب الوقت من تاريخ المباشرة الى الوقت الحالي يحدث يوميا)
 */
export function calculateActiveService(startDateStr: string): string {
  if (!startDateStr) return 'غير متوفر';
  const start = new Date(startDateStr);
  const now = new Date();
  if (isNaN(start.getTime())) return 'تاريخ غير صالح';
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  const yearText = years > 0 ? `${years} سنة` : '';
  const monthText = months > 0 ? `${months} شهر` : '';
  const dayText = days > 0 ? `${days} يوم` : '';
  
  return [yearText, monthText, dayText].filter(Boolean).join(' و ') || 'منذ اليوم';
}

/**
 * Applies the Iraqi Decision Grade rule (تطبيق درجة القرار)
 * Decision marks pool is either 5 or 10.
 * Priority: Bumps 49 first (needs 1 mark), then 48 (needs 2), then 47 (needs 3), 46 (4), 45 (5) to reach 50.
 * Decision marks are decremented from the total pool.
 * Maximum total marks added across ALL subjects must not exceed the specified limit (5 or 10).
 */
export function applyDecisionGrades(
  grades: Record<string, SubjectGrades>,
  decisionLimit: number,
  allowedSubjects: string[]
): { updatedGrades: Record<string, SubjectGrades>; decisionAppliedTotal: number } {
  // Deep clone grades to avoid mutation and reset previous state
  const updatedGrades: Record<string, SubjectGrades> = {};
  for (const sub of Object.keys(grades)) {
    updatedGrades[sub] = { 
      ...grades[sub],
      decisionApplied: 0,
      finalAfterDecision: grades[sub].finalGrade
    };
  }

  const limitNum = Number(decisionLimit) || 5;
  let remainingDecision = limitNum;
  
  // Dynamically build target source grades based on the configured decisionLimit.
  // Priority: closest to passing is boosted first (49, then 48, etc.).
  // - If decisionLimit is 10, targets will be [49, 48, 47, 46, 45, 44, 43, 42, 41, 40]
  // - If decisionLimit is 5, targets will be [49, 48, 47, 46, 45]
  const targets: number[] = [];
  for (let i = 1; i <= limitNum; i++) {
    targets.push(50 - i);
  }

  for (const targetScore of targets) {
    const need = 50 - targetScore;
    for (const subKey of allowedSubjects) {
      if (remainingDecision >= need) {
        const subGr = updatedGrades[subKey];
        if (subGr && subGr.finalGrade !== undefined) {
          const roundedGrade = Math.round(subGr.finalGrade);
          // Only apply decision if the grade has not already had decision applied
          if (roundedGrade === targetScore && (subGr.decisionApplied === 0 || subGr.decisionApplied === undefined)) {
            subGr.decisionApplied = need;
            subGr.finalAfterDecision = 50;
            remainingDecision -= need;
          }
        }
      }
    }
  }

  return {
    updatedGrades,
    decisionAppliedTotal: limitNum - remainingDecision
  };
}

/**
 * Calculates all grades and outcomes for a single student recursively or iteratively
 */
export function recalculateStudentGrades(
  student: Student,
  decisionLimit: number,
  allowedSubjects: string[]
): Student {
  const updatedGrades: Record<string, SubjectGrades> = {};
  const limitNum = Number(decisionLimit) || 5;

  // Step 1: Base calculations per subject
  for (const subKey of allowedSubjects) {
    const sub = student.grades[subKey] || {};
    
    // Calculate Averages as clean rounded integers
    const avg1 = safeAvg(sub.m1t1, sub.m2t1);
    const avg2 = safeAvg(sub.m1t2, sub.m2t2);
    
    const midyear = sub.midyear;
    // ALWAYS calculate endeavor from months/midyear dynamically to avoid manual mismatch bugs
    const endeavor = calculateEndeavor(avg1, midyear, avg2);
    const finalExam = sub.finalExam;
    
    let finalGrade: number | undefined = undefined;
    if (endeavor !== undefined && finalExam !== undefined) {
      finalGrade = Math.round((endeavor + finalExam) / 2);
    }

    updatedGrades[subKey] = {
      ...sub,
      avg1,
      avg2,
      endeavor,
      finalGrade,
      decisionApplied: 0,
      finalAfterDecision: finalGrade,
    };
  }

  // Step 2: Apply decision grades across all active subjects
  const { updatedGrades: withDecision } = applyDecisionGrades(updatedGrades, limitNum, allowedSubjects);

  // Step 3: Determine results per subject & overall
  let failCount = 0;
  const failedSubjectsList: string[] = [];
  let isGradedAny = false;

  for (const subKey of allowedSubjects) {
    const sub = withDecision[subKey];
    if (sub) {
      if (sub.finalAfterDecision !== undefined) {
        isGradedAny = true;
        const score = sub.finalAfterDecision;
        
        // Check if Second Attempt is entered
        if (sub.secondAttemptExam !== undefined && score < 50) {
          // Second Attempt grade is: Math.round((Saei + SecondAttempt) / 2)
          const endeavorVal = sub.endeavor ?? 50; // fallback if endeavor is empty
          sub.secondAttemptGrade = Math.round((endeavorVal + sub.secondAttemptExam) / 2);
          
          if (sub.secondAttemptGrade >= 50) {
            sub.result = 'ناجح';
          } else {
            sub.result = 'راسب';
            failCount++;
            failedSubjectsList.push(`${subKey} (الدور الثاني)`);
          }
        } else if (score >= 50) {
          sub.result = 'ناجح';
        } else {
          // Here score < 50 and no secondAttemptExam is entered yet
          sub.result = 'راسب';
          failCount++;
          failedSubjectsList.push(subKey);
        }
      } else {
        sub.result = 'مستمر';
      }
    }
  }

  // Determine overall status based on exact Iraqi user rules:
  // 1 or 2 fails (مرتان أو أقل) -> مكمل
  // 3 or more fails (ثلاث مرات أو أكثر) -> راسب
  // 0 fails -> ناجح
  // BUT if any allowed subject has not been fully graded (finalAfterDecision is undefined), 
  // they are marked as 'مستمر' (continuous / in-progress) except if they have already failed 3+ subjects.
  const hasMissingGrade = allowedSubjects.some(subKey => {
    const sub = withDecision[subKey];
    return !sub || sub.finalAfterDecision === undefined;
  });

  let overallResult: 'ناجح' | 'راسب' | 'مكمل' | 'مستمر' = 'مستمر';
  if (isGradedAny) {
    if (failCount >= 3) {
      overallResult = 'راسب';
    } else if (hasMissingGrade) {
      overallResult = 'مستمر';
    } else {
      if (failCount === 0) {
        overallResult = 'ناجح';
      } else if (failCount === 1 || failCount === 2) {
        overallResult = 'مكمل';
      }
    }
  }

  return {
    ...student,
    grades: withDecision,
    overallResult,
    failedSubjectsList,
  };
}
