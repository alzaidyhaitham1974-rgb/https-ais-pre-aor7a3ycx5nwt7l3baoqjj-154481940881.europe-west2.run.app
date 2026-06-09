/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, CheckCircle2, AlertTriangle, Play, RefreshCcw } from 'lucide-react';
import { Student, SubjectKey, AppSettings } from '../types';
import { recalculateStudentGrades } from '../utils';

interface RolloverSystemProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function RolloverSystem({ students, setStudents, settings, setSettings }: RolloverSystemProps) {
  const [successSummary, setSuccessSummary] = useState<{
    graduated: number;
    fourthToFifth: number;
    fifthToSixth: number;
    repeatingFourth: number;
    repeatingFifth: number;
    repeatingSixth: number;
  } | null>(null);

  const handleRollover = () => {
    // 1. Initial browser modal ask as requested
    const confirmed = window.confirm('هل تريد ترحيل النتائج وتصفية سجلات الدرجات للعام الجديد؟');
    if (!confirmed) return;

    let graduatedCount = 0;
    let fourthToFifthCount = 0;
    let fifthToSixthCount = 0;
    let repeatingFourthCount = 0;
    let repeatingFifthCount = 0;
    let repeatingSixthCount = 0;

    const updatedStudentsList: Student[] = students.map(student => {
      const isPassed = student.overallResult === 'ناجح';
      let targetClass = student.className;
      let isGraduate = student.isGraduate ?? false;

      if (student.className === 'السادس العلمي') {
        if (isPassed) {
          isGraduate = true;
          graduatedCount++;
        } else {
          targetClass = 'السادس العلمي'; // repeats
          repeatingSixthCount++;
        }
      } else if (student.className === 'الخامس العلمي') {
        if (isPassed) {
          targetClass = 'السادس العلمي'; // promoted
          fifthToSixthCount++;
        } else {
          targetClass = 'الخامس العلمي'; // repeats
          repeatingFifthCount++;
        }
      } else if (student.className === 'الرابع العلمي') {
        if (isPassed) {
          targetClass = 'الخامس العلمي'; // promoted
          fourthToFifthCount++;
        } else {
          targetClass = 'الرابع العلمي'; // repeats
          repeatingFourthCount++;
        }
      }

      // Prepare a clean reset grades structure for the new class
      const clearedGrades: Record<string, any> = {};
      Object.values(SubjectKey).forEach(k => {
        clearedGrades[k] = {};
      });

      const updatedStudent: Student = {
        ...student,
        className: targetClass,
        isGraduate,
        grades: clearedGrades,
        overallResult: 'مستمر',
        failedSubjectsList: []
      };

      // Recalculate blank structure
      return recalculateStudentGrades(updatedStudent, settings.decisionLimit, Object.values(SubjectKey));
    });

    // Advance academic years as requested so students move from previous to current
    const advanceAcademicYear = (yearStr: string): string => {
      const engYearStr = yearStr.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
      const match = engYearStr.match(/(\d{4})[^\d]+(\d{4})/);
      if (match) {
        const y1 = parseInt(match[1]) + 1;
        const y2 = parseInt(match[2]) + 1;
        const isArabic = /[٠-٩]/.test(yearStr);
        const separator = yearStr.includes('/') ? ' / ' : '-';
        const result = `${y1}${separator}${y2}`;
        if (isArabic) {
          return result.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
        }
        return result;
      }
      return yearStr;
    };

    const nextCurrentYear = advanceAcademicYear(settings.currentAcademicYear);
    const nextPreviousYear = settings.currentAcademicYear;

    setSettings(prev => ({
      ...prev,
      currentAcademicYear: nextCurrentYear,
      previousAcademicYear: nextPreviousYear
    }));

    // Save promoted/rolled-over students
    setStudents(updatedStudentsList);
    setSuccessSummary({
      graduated: graduatedCount,
      fourthToFifth: fourthToFifthCount,
      fifthToSixth: fifthToSixthCount,
      repeatingFourth: repeatingFourthCount,
      repeatingFifth: repeatingFifthCount,
      repeatingSixth: repeatingSixthCount
    });
  };

  const handleResetSim = () => {
    setSuccessSummary(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5 text-orange-850 mb-1">
            <ArrowRightLeft className="h-6 w-6 text-orange-600 animate-pulse-slow" />
            <h2 className="text-xl font-bold">شيت ومعالج ترحيل الطلاب ونهاية العام</h2>
          </div>
          <p className="text-xs text-slate-400">نظام ذكي يقوم بنقل الطلاب المرفعين والناجحين للفصل الأعلى وتثبيت المعيدين وتصفية الخريجين</p>
        </div>
      </div>

      {/* Safety Warning block */}
      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 text-rose-900 text-xs mb-6 max-w-2xl leading-relaxed">
        <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
        <div>
          <p className="font-extrabold mb-1">تنبيه أمان مدرسي حساس:</p>
          <p>
            عملية الترحيل نهائية ولا رجعة فيها! ستقوم بترقية جميع الطلاب الناجحين لمستوياتهم الأعلى (الرابع إلى الخامس، والخامس إلى السادس، والسادس إلى الخريجون) وإبقاء الفاشلين مع تصفية وتصفير كشوفات ورصد الدرجات بالكامل لبداية عام دراسي نظيف. يرجى رصد الدور الثاني أولاً قبل النقر.
          </p>
        </div>
      </div>

      {successSummary ? (
        <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-2xl space-y-4 max-w-2xl animate-fade-in/80">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <h3 className="text-md font-bold">تم إتمام ترحيل وتصفية النتائج بنجاح!</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 pt-2 font-mono">
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>الخريجون (السادس العلمي):</span>{' '}
              <strong className="text-emerald-800 text-sm font-extrabold">{successSummary.graduated} طالب</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>مرفعين من الرابع إلى الخامس:</span>{' '}
              <strong className="text-indigo-850 text-sm font-extrabold">{successSummary.fourthToFifth} طالب</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>مرفعين من الخامس إلى السادس:</span>{' '}
              <strong className="text-indigo-850 text-sm font-extrabold">{successSummary.fifthToSixth} طالب</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>المعيدون بالرابع العلمي:</span>{' '}
              <strong className="text-rose-800 text-sm font-extrabold">{successSummary.repeatingFourth} طالب</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>المعيدون بالخامس العلمي:</span>{' '}
              <strong className="text-rose-800 text-sm font-extrabold">{successSummary.repeatingFifth} طالب</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
              <span>المعيدون بالسادس العلمي:</span>{' '}
              <strong className="text-rose-800 text-sm font-extrabold">{successSummary.repeatingSixth} طالب</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetSim}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-semibold text-xs cursor-pointer"
            >
              متابعة وإدخال درجات العام الجديد
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500">مستعد للبدء؟ باشر ترحيل القوائم الكلية بالكبسة أدناه:</p>
          <button
            onClick={handleRollover}
            className="flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-all shadow-lg active:scale-98 cursor-pointer"
          >
            <Play className="h-4.5 w-4.5 animate-pulse" />
            بدء ترحيل نتائج الدور الأول والدور الثاني للمدرسة
          </button>
        </div>
      )}

    </div>
  );
}
