/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Printer, Users, Clipboard, Plus, Check } from 'lucide-react';
import { OfficialLetter, AppSettings, Teacher, Staff, Student } from '../types';

interface LetterGeneratorProps {
  settings: AppSettings;
  teachers: Teacher[];
  staff: Staff[];
  students: Student[];
}

// Compact helper to convert Arabic numbers (0-1500) to words
function arabicNumberToWords(num: number): string {
  if (num === 0) return 'صفر';
  if (num === 100) return 'مئة';
  
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const specialObj: Record<number, string> = {
    10: 'عشرة', 11: 'أحد عشر', 12: 'اثنا عشر', 13: 'ثلاثة عشر', 14: 'أربعة عشر',
    15: 'خمسة عشر', 16: 'ستة عشر', 17: 'سبعة عشر', 18: 'ثمانية عشر', 19: 'تسعة عشر'
  };

  if (num >= 10 && num <= 19) return specialObj[num];
  
  const hDigit = Math.floor(num / 100);
  const remainder = num % 100;
  
  let hStr = '';
  if (hDigit > 0) {
    if (hDigit === 1) hStr = 'مئة';
    else if (hDigit === 2) hStr = 'مئتان';
    else if (hDigit >= 3 && hDigit <= 9) hStr = ones[hDigit] + 'مئة';
    else hStr = ones[hDigit] + ' مائة';
  }

  let remStr = '';
  if (remainder > 0) {
    if (remainder >= 10 && remainder <= 19) {
      remStr = specialObj[remainder];
    } else {
      const onesDigit = remainder % 10;
      const tensDigit = Math.floor(remainder / 10);
      if (onesDigit === 0) remStr = tens[tensDigit];
      else if (tensDigit === 0) remStr = ones[onesDigit];
      else remStr = ones[onesDigit] + ' و' + tens[tensDigit];
    }
  }

  if (hStr && remStr) return hStr + ' و' + remStr;
  return hStr || remStr || 'صفر';
}

export function LetterGenerator({ settings, teachers, staff, students }: LetterGeneratorProps) {
  const [targetType, setTargetType] = useState<'مدرس' | 'موظف' | 'طالب'>('مدرس');
  const [selectedName, setSelectedName] = useState('');
  const [recipient, setRecipient] = useState('المديرية العامة لتربية ذي قار / قسم التعليم الثانوي');
  const [letterType, setLetterType] = useState<OfficialLetter['type']>('مباشرة');
  const [refNum, setRefNum] = useState('ش/٩٩٢');
  const [customSubject, setCustomSubject] = useState('مباشرة (مدرس, موظف)');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);

  // Secondary variables
  const [specialtyOrJob, setSpecialtyOrJob] = useState('الرياضيات');
  const [transferPlace, setTransferPlace] = useState('ثانوية المتميزين للبنين');
  const [refLetterNum, setRefLetterNum] = useState('٢٠٩٤');
  const [refLetterDate, setRefLetterDate] = useState('2026-05-10');
  const [academicYear, setAcademicYear] = useState(settings.currentAcademicYear || '٢٠٢٦ / ٢٠٢٧');
  const [letterBody, setLetterBody] = useState('');
  const [closingBody, setClosingBody] = useState('');

  React.useEffect(() => {
    if (settings.currentAcademicYear) {
      setAcademicYear(settings.currentAcademicYear);
    }
  }, [settings.currentAcademicYear]);

  // Student specific vars
  const [studentDob, setStudentDob] = useState('٢٠١٠');
  const [studentGov, setStudentGov] = useState('ذي قار');
  const [studentGradClass, setStudentGradClass] = useState('الخامس العلمي');
  const [studentResultStatus, setStudentResultStatus] = useState('ناجح');
  const [studentAttempt, setStudentAttempt] = useState('الأول');

  // "واقع حال" vars
  const [sourceDocPlace, setSourceDocPlace] = useState('قسم تربية الناصرية');
  const [sourceDocNum, setSourceDocNum] = useState('ش/٤٩٢');
  const [sourceDocDate, setSourceDocDate] = useState('٢٠٢٦/٥/١٠');
  const [transferDocNum, setTransferDocNum] = useState('ت/٧٧');
  const [transferDocDate, setTransferDocDate] = useState('٢٠٢٦/٦/١');
  const [transferToSchool, setTransferToSchool] = useState('مدرسة الغري النموذجية');
  const [timelineRows, setTimelineRows] = useState([
    { className: 'الرابع العلمي', year: '٢٠٢٤ / ٢٠٢٥', result: 'ناجح', attempt: 'الأول', notes: 'ناجح بمعدل ٨٢%' },
    { className: 'الخامس العلمي', year: '٢٠٢٥ / ٢٠٢٦', result: 'ناجح', attempt: 'الأول', notes: 'ناجح ومصنف علمي' },
    { className: '', year: '', result: '', attempt: '', notes: '' },
    { className: '', year: '', result: '', attempt: '', notes: '' },
  ]);

  // "مباشرة الهيئة" vars
  const [dutyDate, setDutyDate] = useState(new Date().toLocaleDateString('ar-IQ'));
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const selectedStudent = students.find(s => s.name === selectedName);

  // Sync target switch by letter type
  useEffect(() => {
    if (letterType === 'تاييد_درجات' || letterType === 'واقع_حال' || letterType === 'قبول_طالب') {
      setTargetType('طالب');
    } else if (letterType === 'مباشرة_الهيئة') {
      setTargetType('مدرس');
    }
  }, [letterType]);

  // Auto load student/staff details on selection
  useEffect(() => {
    if (targetType === 'مدرس') {
      const match = teachers.find(t => t.name === selectedName);
      if (match) setSpecialtyOrJob(match.specialty);
    } else if (targetType === 'موظف') {
      const match = staff.find(s => s.name === selectedName);
      if (match) setSpecialtyOrJob(match.jobTitle);
    } else if (targetType === 'طالب' && selectedStudent) {
      setSpecialtyOrJob(selectedStudent.className);
      setStudentDob(selectedStudent.dob ? selectedStudent.dob.split('-')[0] : '٢٠١٠');
      setStudentGov(selectedStudent.birthPlace || 'ذي قار');
      setStudentGradClass(selectedStudent.className);
      setStudentResultStatus(selectedStudent.overallResult);
    }
  }, [selectedName, targetType, selectedStudent]);

  // Dynamic template text generator!
  useEffect(() => {
    let body = '';
    let closing = '';
    const dateFormatted = new Date(customDate).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
    const label = targetType === 'مدرس' ? 'المدرس' : (targetType === 'موظف' ? 'الموظف' : 'الطالب');

    switch (letterType) {
      case 'تاييد_استمرار':
      case 'تاييد':
        body = `نؤيد استمرار السيد ( ${selectedName || '....................'} ) بصفته ( ${specialtyOrJob || '........'} ) بالدوام في مدرستنا للعام الدراسي الحالي ( ${academicYear} )، وبناءً على طلبه زود بهذا التأييد للتفضل بالعلم مع التقدير.`;
        setCustomSubject('تاييد استمرار بالخدمة والدوام');
        break;
      case 'مباشرة':
        body = `إستناداً إلى كتاب المديرية العامة للتربية في ذي قار / قسم تربية الناصرية / الملاك الثانوي المرقم ( ${refLetterNum} ) في ( ${refLetterDate} )، باشر السيد ( ${selectedName || '....................'} ) بصفة ( ${specialtyOrJob || '........'} ) في مدرستنا ( ${settings.schoolName} ) لهذا اليوم ( ${dateFormatted} ) منقولاً / منسباً من ( ${transferPlace || '........'} )، راجين تسجيل المباشرة لديهم مع التقدير.`;
        setCustomSubject('مباشرة (مدرس, موظف)');
        break;
      case 'انفكاك':
        body = `إستناداً إلى كتاب المديرية العامة للتربية في ذي قار / قسم تربية الناصرية / الملاك الثانوي المرقم ( ${refLetterNum} ) في ( ${refLetterDate} )، انفك السيد ( ${selectedName || '....................'} ) بصفة ( ${specialtyOrJob || '........'} ) في مدرستنا لهذا اليوم ( ${dateFormatted} ) منقولاً / منسباً إلى ( ${transferPlace || '........'} )، راجين تسوية ملاكه مع التقدير.`;
        setCustomSubject('انفكاك (مدرس, موظف)');
        break;
      case 'استفسار':
        body = `إلى السيد ( ${selectedName || '....................'} ) بصفة ( ${specialtyOrJob || '........'} ) المحترم: نسبب لكم هذا الاستفسار بخصوص عدم بيان الأسباب الموجبة للغياب أو التقصير في الدوران المدرسي، يرجى تزويدنا بالمبررات الرسمية خلال مدة لا تتجاوز ٢٤ ساعة من تاريخ التبليغ.`;
        setCustomSubject('استفسار ولفت نظر أداري');
        break;
      case 'طلب_اجازة':
        body = `يرجى التفضل بالموافقة على منح السيد ( ${selectedName || '....................'} ) بصفة ( ${specialtyOrJob || '........'} ) إجازة اعتيادية / مرضية أمدها خمسة أيام تبدأ مفعولها من الأسبوع القادم وذلك نظراً للظروف الصحية الطارئة المذكورة مع التقدير.`;
        setCustomSubject('طلب إجازة رسمية');
        break;
      case 'قبول_طالب':
        body = `لا مانع لدينا من قبول الطالب ( ${selectedName || '....................'} ) في الصف ( ${studentGradClass || 'الخامس العلمي'} ) في مدرستنا للعام الدراسي ( ${academicYear || '.........'} ) بعد تزويده بأوراق نقله مع الكتب والقرطاسية والبطاقة المدرسية مع الشكر والتقدير......`;
        setCustomSubject('قبول طالب');
        break;
      case 'تاييد_درجات':
        body = `نؤيد لكم بأن الطالب ( ${selectedName || '....................'} ) تولد (${studentDob}) محافظة (${studentGov}) تخرج من الصف (${studentGradClass}) للعام الدراسي (${academicYear}) من مدرستنا وكانت نتيجته (${studentResultStatus}) في الدور (${studentAttempt}) وكما موضح في أدناه:`;
        closing = 'وبناءً على طلبه زود بهذا التأييد . للتفضل بالعلم والاطلاع ...... مع التقدير';
        setCustomSubject('تأييد درجات طالب');
        break;
      case 'واقع_حال':
        body = `نؤيد لكم بأن الطالب ( ${selectedName || '....................'} ) تولد (${studentDob}) محافظة (${studentGov}) في صف (${studentGradClass}) للعام الدراسي (${academicYear}) والملصقة صورته أعلاه في مدرستنا بموجب الوثيقة الصادرة من (${sourceDocPlace}) والمرقمة (${sourceDocNum}) بتاريخ (${sourceDocDate}) وكانت نتيجته في المراحل والأعوام الدراسية كما موضح أدناه:`;
        closing = `وتخرج / ونقل من مدرستنا بموجب الوثيقة المرقمة (${transferDocNum}) في (${transferDocDate}) والمدونة إلى (${transferToSchool}) وبناءً على طلبه زود بهذا الكتاب . للتفضل بالعلم والاطلاع ...... مع التقدير`;
        setCustomSubject('واقع حال طالب');
        break;
      case 'مباشرة_الهيئة':
        body = `تحية طيبة ...... \nباشر الذوات المدرجة أسماؤهم في أدناه الدوام الرسمي في مدرستنا هذا اليوم الموافق (${dutyDate || new Date().toLocaleDateString('ar-IQ')}) لاتخاذ ما يلزم ... مع التقدير:`;
        closing = 'لاتخاذ ما يلزم ...... مع التقدير';
        setCustomSubject('مباشرة الهيئة الإدارية والتدريسية');
        break;
      default:
        body = '';
    }
    setLetterBody(body);
    setClosingBody(closing);
  }, [
    letterType, selectedName, targetType, specialtyOrJob, transferPlace,
    refLetterNum, refLetterDate, academicYear, settings.schoolName, customDate,
    studentDob, studentGov, studentGradClass, studentResultStatus, studentAttempt,
    sourceDocPlace, sourceDocNum, sourceDocDate, transferDocNum, transferDocDate,
    transferToSchool, dutyDate
  ]);

  // Extract Grades details dynamically
  const activeSubs = selectedStudent ? (settings.allowedSubjects[selectedStudent.className] || []) : [];
  const activeGradesList = selectedStudent 
    ? activeSubs.map(subKey => {
        const subGrades = selectedStudent.grades[subKey] || {};
        return {
          subject: subKey,
          score: subGrades.finalAfterDecision ?? subGrades.finalGrade
        };
      })
    : [];

  const totalScore = activeGradesList.reduce((acc, curr) => acc + (curr.score || 0), 0);

  // Form selected staff list (checked boxes)
  const staffCheckboxPool = [...teachers.map(t => ({ id: t.id, name: t.name, title: t.jobTitle })), ...staff.map(s => ({ id: s.id, name: s.name, title: s.jobTitle }))];
  const selectedStaffList = staffCheckboxPool
    .filter(item => selectedStaffIds.includes(item.id))
    .map(item => ({ name: item.name, jobTitle: item.title, notes: 'باشر بالدوام الفعلي صباحاً' }));

  const toggleStaffSelection = (id: string) => {
    setSelectedStaffIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error("Popup blocked");

      const logoHeaderHTML = settings.logoUrl 
        ? (settings.logoUrl.trim().startsWith('<svg') 
            ? `<div style="width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; max-width: 100%; max-height: 100%;">${settings.logoUrl}</div>`
            : `<img class="object-contain" src="${settings.logoUrl}" style="width: 76px; height: 76px; max-height: 100%; object-fit: contain; mix-blend-mode: multiply;" />`) 
        : '';

      let printableBody = '';

      if (letterType === 'تاييد_درجات') {
        const tableContent = activeGradesList.map((gradeRow, idx) => `
          <tr>
            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${idx + 1}</td>
            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">${gradeRow.subject}</td>
            <td style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold;">${gradeRow.score ?? '-'}</td>
            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${gradeRow.score !== undefined ? arabicNumberToWords(gradeRow.score) : '—'}</td>
            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${gradeRow.score !== undefined ? (gradeRow.score >= 50 ? 'ناجح' : 'راسب') : '—'}</td>
          </tr>
        `).join('');

        printableBody = `
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-underline-offset: 4px; color: #064e3b;">إلى / ${recipient || ' الجهة المعنية '}</h3>
            <h4 style="font-size: 15px; font-weight: 800; margin-top: 10px;">الموضوع / تأييد درجات</h4>
          </div>
          <div style="font-size: 14px; line-height: 2; text-align: justify; direction: rtl; margin-bottom: 15px;">
            ${letterBody.replace(/\n/g, '<br>')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;" dir="rtl">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 40px;">ت</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: right;">المادة</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 100px;">الدرجة رقماً</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">الدرجة كتابة</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 100px;">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
              <tr style="background-color: #f0fdf4; font-weight: bold;">
                <td style="border: 1px solid #000; padding: 5px; text-align: center;" colspan="2">المجموع</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: center;">${totalScore}</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: center;" colspan="2">${arabicNumberToWords(totalScore)} (مجموع درجات الطالب)</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size: 14px; margin-top: 20px; direction: rtl;">
            ${closingBody.replace(/\n/g, '<br>')}
          </div>
        `;
      } else if (letterType === 'واقع_حال') {
        const tableContent = timelineRows.map((row, idx) => `
          <tr>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${idx + 1}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: right;">${row.className || '.........'}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${row.year || '.........'}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${row.result || '.........'}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${row.attempt || '.........'}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${row.notes || ''}</td>
          </tr>
        `).join('');

        printableBody = `
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-underline-offset: 4px; color: #064e3b;">إلى / ${recipient || ' الجهة المعنية '}</h3>
            <h4 style="font-size: 15px; font-weight: 800; margin-top: 10px;">الموضوع / واقع حال طالب</h4>
          </div>
          <div style="font-size: 14px; line-height: 2; text-align: justify; direction: rtl; margin-bottom: 15px;">
            ${letterBody.replace(/\n/g, '<br>')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;" dir="rtl">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 40px;">ت</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: right;">الصف</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">العام الدراسي</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">النتيجة</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">الدور</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
            </tbody>
          </table>
          <div style="font-size: 14px; line-height: 2; text-align: justify; margin-top: 15px; direction: rtl;">
            ${closingBody.replace(/\n/g, '<br>')}
          </div>
        `;
      } else if (letterType === 'قبول_طالب') {
        printableBody = `
          <div style="text-align: center; margin: 40px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-underline-offset: 4px; color: #064e3b;">إلى / ${recipient || ' جهة القبول المحترمون '}</h3>
            <h4 style="font-size: 15px; font-weight: 800; margin-top: 10px;">الموضوع / قبول طالب</h4>
          </div>
          <div style="font-size: 16px; line-height: 2.2; text-align: justify; margin: 30px 10px; direction: rtl; text-indent: 25px;">
            ${letterBody.replace(/\n/g, '<br>')}
          </div>
        `;
      } else if (letterType === 'مباشرة_الهيئة') {
        const tableContent = selectedStaffList.map((item, idx) => `
          <tr>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${idx + 1}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: right; font-weight: bold;">${item.name}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.jobTitle}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.notes}</td>
          </tr>
        `).join('');

        printableBody = `
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-underline-offset: 4px; color: #064e3b;">إلى / ${recipient || ' الجهة المعنية المحترمون '}</h3>
            <h4 style="font-size: 15px; font-weight: 800; margin-top: 10px;">الموضوع / مباشرة</h4>
          </div>
          <div style="font-size: 14px; line-height: 2; margin-bottom: 15px; direction: rtl;">
            ${letterBody.replace(/\n/g, '<br>')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;" dir="rtl">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 40px;">ت</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: right;">الاسم الثلاثي</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 140px;">العنوان الوظيفي</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
            </tbody>
          </table>
          <div style="font-size: 14px; margin-top: 15px; direction: rtl;">
            ${closingBody.replace(/\n/g, '<br>')}
          </div>
        `;
      } else {
        printableBody = `
          <div style="text-align: center; margin: 30px 0 20px 0;">
            <h3 style="font-size: 16px; font-weight: bold; text-decoration: underline; text-underline-offset: 4px; color: #064e3b;">إلى / ${recipient || ' الجهة المعنية '}</h3>
            <h4 style="font-size: 14px; color: #475569; margin-top: 10px;">الموضوع / ${customSubject}</h4>
          </div>
          <div style="font-size: 15px; line-height: 2.2; text-align: justify; margin: 30px 10px 40px 10px; direction: rtl; text-indent: 25px;">
            ${letterBody.replace(/\n/g, '<br>')}
          </div>
        `;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>${customSubject} - ${settings.schoolName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 0; margin: 0; background-color: white; color: #1e293b; }
            .container { width: 180mm; min-height: 257mm; margin: 10mm auto; padding: 10mm; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; font-size: 12px; font-weight: bold; }
            .content { flex-grow: 1; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; margin-bottom: 20px; font-size: 13px; }
            .signature-box { text-align: center; display: flex; flex-direction: column; align-items: center; }
            .bottom-line { text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; font-size: 10px; color: #64748b; }
            @media print {
              .container { margin: 0; padding: 0; width: 100%; min-height: 100%; }
              @page { size: A4 portrait; margin: 15mm !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header" dir="rtl">
              <div style="text-align: right; width: 40%;">
                <div style="display: inline-flex; flex-direction: column; align-items: center; text-align: center; font-family: 'Cairo', sans-serif;">
                  <span style="font-size: 10px; color: #475569; font-weight: bold; margin-bottom: 2px;">إدارة</span>
                  <span style="font-size: 14px; font-weight: 800; color: #064e3b; line-height: 1.2;">${settings.schoolName}</span>
                </div>
              </div>
              <div style="width: 20%; display: flex; justify-content: center; align-items: center;">
                ${logoHeaderHTML}
              </div>
              <div style="text-align: left; width: 40%; font-family: monospace;">
                <div>العدد / ${refNum}</div>
                <div>التاريخ / ${new Date(customDate).toLocaleDateString('ar-IQ')}</div>
              </div>
            </div>
            <div class="content">${printableBody}</div>
            <div class="footer">
              <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; font-style: italic;">
              </div>
              <div class="signature-box">
                <div style="font-weight: 800; font-size: 15px; border-bottom: 1px solid #1e293b; padding-bottom: 2px; margin-bottom: 2px;">${settings.principalName}</div>
                <div style="font-size: 11px; color: #475569; font-weight: bold;">${settings.principalTitle}</div>
              </div>
            </div>
            <div class="bottom-line">
            </div>
          </div>
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 400); };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  };

  const getTargetOptions = () => {
    if (targetType === 'مدرس') return teachers.map(t => t.name);
    if (targetType === 'موظف') return staff.map(s => s.name);
    return students.map(s => s.name);
  };

  const isStudentLetter = letterType === 'تاييد_درجات' || letterType === 'واقع_حال' || letterType === 'قبول_طالب';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* 1. Sidebar Parameter Controls */}
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 print:hidden space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
            <Mail className="h-5 w-5" />
            <h3 className="text-sm font-bold">صياغة المخاطبات الرسمية</h3>
          </div>
          <p className="text-[11px] text-slate-400">اختر نوع الكتاب، الموضوع، والاسم لتوليد المستند فوريآ بمجرد نقرة واحدة</p>
        </div>

        <div className="space-y-3.5 text-xs font-semibold text-slate-500">
          <div>
            <label className="block mb-1">نوع الكتاب الرسمي</label>
            <select
              value={letterType}
              onChange={(e) => {
                const val = e.target.value as any;
                setLetterType(val);
                setSelectedName('');
              }}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700 font-normal outline-none text-xs"
            >
              <option value="مباشرة">مباشرة (مدرس, موظف)</option>
              <option value="انفكاك">انفكاك (مدرس, موظف)</option>
              <option value="استفسار">استفسار مدرس / موظف</option>
              <option value="طلب_اجازة">طلب اجازة مدرس / موظف</option>
              <option value="تاييد_استمرار">تأييد استمرار بالخدمة</option>
              <option value="تاييد">تأييد عام</option>
              <option value="تاييد_درجات">تأييد درجات طالب 📄</option>
              <option value="واقع_حال">واقع حال طالب 📊</option>
              <option value="قبول_طالب">قبول طالب ✅</option>
              <option value="مباشرة_الهيئة">مباشرة الهيئة الإدارية والتدريسية 👥</option>
            </select>
          </div>

          {/* Target category switch (only if not choosing locked types) */}
          {!isStudentLetter && letterType !== 'مباشرة_الهيئة' && (
            <div>
              <label className="block mb-1">الفئة المستهدفة</label>
              <div className="grid grid-cols-2 gap-2">
                {(['مدرس', 'موظف'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setTargetType(type); setSelectedName(''); }}
                    className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      targetType === type 
                        ? 'bg-emerald-50 text-emerald-850 border-emerald-300 font-bold' 
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Select Name (unless directly picking staffing table) */}
          {letterType !== 'مباشرة_الهيئة' && (
            <div>
              <label className="block mb-1">
                {isStudentLetter ? 'اختر اسم الطالب' : 'الاسم المعني بالكتاب'}
              </label>
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-705 font-normal outline-none text-xs"
              >
                <option value="">-- اختر الاسم المعنى --</option>
                {getTargetOptions().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Checkbox Group for staffingDuty resumption table */}
          {letterType === 'مباشرة_الهيئة' && (
            <div className="space-y-1.5">
              <label className="block text-slate-600">اختر المنسبين/أعضاء الهيئة للمباشرة اليوم:</label>
              <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
                {staffCheckboxPool.map(staffItem => {
                  const isChecked = selectedStaffIds.includes(staffItem.id);
                  return (
                    <div 
                      key={staffItem.id} 
                      onClick={() => toggleStaffSelection(staffItem.id)}
                      className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 cursor-pointer text-[10px]"
                    >
                      <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-slate-300 bg-white'}`}>
                        {isChecked && <Check className="h-2 w-2" />}
                      </div>
                      <span className="text-slate-800 font-bold font-sans">{staffItem.name}</span>
                      <span className="text-slate-400 font-normal">({staffItem.title})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1">الجهة المعنون إليها الكتاب</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700 font-normal outline-none text-xs text-right"
            />
          </div>

          {/* Conditional parameters based on letters */}
          {(letterType === 'مباشرة' || letterType === 'انفكاك') && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 space-y-2">
              <div>
                <label className="block mb-1">الجهة المنقول منها / إليها</label>
                <input
                  type="text"
                  value={transferPlace}
                  onChange={(e) => setTransferPlace(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white p-1 text-xs font-normal"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">رقم كتاب الملاك</label>
                  <input
                    type="text"
                    value={refLetterNum}
                    onChange={(e) => setRefLetterNum(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-white p-1 text-xs font-normal"
                  />
                </div>
                <div>
                  <label className="block mb-1">تاريخ كتاب الملاك</label>
                  <input
                    type="date"
                    value={refLetterDate}
                    onChange={(e) => setRefLetterDate(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-white p-1 text-[9px] font-normal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* تأييد درجات & واقع حال custom tags */}
          {isStudentLetter && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 space-y-2 text-[10px]">
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block mb-0.5">تولد الطالب</label>
                  <input
                    type="text"
                    value={studentDob}
                    onChange={(e) => setStudentDob(e.target.value)}
                    className="w-full bg-white border rounded p-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-0.5">محافظة السكن</label>
                  <input
                    type="text"
                    value={studentGov}
                    onChange={(e) => setStudentGov(e.target.value)}
                    className="w-full bg-white border rounded p-1 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block mb-0.5">الصف الدراسي</label>
                  <input
                    type="text"
                    value={studentGradClass}
                    onChange={(e) => setStudentGradClass(e.target.value)}
                    className="w-full bg-white border rounded p-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-0.5">العام الدراسي</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-white border rounded p-1 text-xs"
                  />
                </div>
              </div>

              {letterType === 'تاييد_درجات' && (
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block mb-0.5">النتيجة الكلية</label>
                    <input
                      type="text"
                      value={studentResultStatus}
                      onChange={(e) => setStudentResultStatus(e.target.value)}
                      className="w-full bg-white border rounded p-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block mb-0.5">الدور</label>
                    <input
                      type="text"
                      value={studentAttempt}
                      onChange={(e) => setStudentAttempt(e.target.value)}
                      className="w-full bg-white border rounded p-1 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Extra واقع حال variables */}
              {letterType === 'واقع_حال' && (
                <div className="space-y-2 pt-1 border-t border-slate-250">
                  <div className="grid grid-cols-3 gap-1">
                    <div>
                      <label className="block mb-0.5">وثيقة صادرة</label>
                      <input type="text" value={sourceDocPlace} onChange={(e) => setSourceDocPlace(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                    <div>
                      <label className="block mb-0.5">رقمها</label>
                      <input type="text" value={sourceDocNum} onChange={(e) => setSourceDocNum(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                    <div>
                      <label className="block mb-0.5">تاريخها</label>
                      <input type="text" value={sourceDocDate} onChange={(e) => setSourceDocDate(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 grid-flow-row">
                    <div>
                      <label className="block mb-0.5">وثيقة نقل</label>
                      <input type="text" value={transferDocNum} onChange={(e) => setTransferDocNum(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                    <div>
                      <label className="block mb-0.5">تاريخ النقل</label>
                      <input type="text" value={transferDocDate} onChange={(e) => setTransferDocDate(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                    <div>
                      <label className="block mb-0.5">منقول إلى</label>
                      <input type="text" value={transferToSchool} onChange={(e) => setTransferToSchool(e.target.value)} className="w-full bg-white border rounded p-1 text-[9px]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {letterType === 'مباشرة_الهيئة' && (
            <div>
              <label className="block mb-1">تاريخ المباشرة</label>
              <input
                type="text"
                value={dutyDate}
                onChange={(e) => setDutyDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700 outline-none text-xs"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">الرقم المرجعي (العدد)</label>
              <input
                type="text"
                value={refNum}
                onChange={(e) => setRefNum(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-700 outline-none font-mono text-center text-xs"
              />
            </div>
            <div>
              <label className="block mb-1">تاريخ صادر الكتاب</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 outline-none text-xs"
              />
            </div>
          </div>

          {/* Dynamic Interactive Note */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 text-[11px] leading-relaxed text-amber-900 select-none">
            <span className="font-extrabold block mb-1">📝 تحرير وتعديل نصوص الكتاب بحرية:</span>
            يمكنك تعديل أي فقرة أو جملة نصية مباشرة داخل ورقة المعاينة (على يسار الشاشة) سواءً بالإدخال أو الحذف أو الشطب قبل النقر على زر الطباعة، وستتم طباعة المستند متبنياً لكل تلك التغييرات!
          </div>

          <div className="pt-2">
            <button
              onClick={handlePrint}
              disabled={letterType !== 'مباشرة_الهيئة' && !selectedName}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              طباعة المستند الرسمي فورياً
            </button>
          </div>
        </div>
      </div>

      {/* 2. live preview sheet */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <div className="bg-white border-[3px] border-double border-slate-350 rounded-2xl w-full max-w-[210mm] min-h-[297mm] p-10 flex flex-col justify-between font-sans leading-relaxed text-slate-800 relative shadow-lg print:border-none print:shadow-none print:p-6" dir="rtl">
          
          {/* Header layout correcting to look exactly like user images */}
          <div>
            <div className="border-b pl-1 pb-3 mb-6 flex justify-between items-start text-xs font-bold text-slate-900 border-slate-800">
              <div className="text-right w-1/3">
                <div className="inline-flex flex-col items-center text-center font-sans">
                  <span className="text-[10px] text-slate-400 font-bold mb-0.5 leading-none">إدارة</span>
                  <span className="text-[13px] font-extrabold text-emerald-955 leading-tight">{settings.schoolName}</span>
                </div>
              </div>
              <div className="flex flex-col items-center select-none w-1/3">
                <div className="w-16 h-16 flex items-center justify-center overflow-visible">
                  {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
                    <div className="w-full h-full p-0.5" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
                  ) : (
                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain mix-blend-multiply filter contrast-125" referrerPolicy="no-referrer" />
                  )}
                </div>
              </div>
              <div className="text-left font-mono flex flex-col gap-0.5 w-1/3">
                <div>العدد / {refNum}</div>
                <div>التاريخ / {new Date(customDate).toLocaleDateString('ar-IQ')}</div>
              </div>
            </div>

            {/* Render Letter Views depending on active letterType */}
            {letterType === 'تاييد_درجات' ? (
              <div>
                <div className="text-center mt-6 mb-4">
                  <h3 className="text-[14px] font-bold underline underline-offset-4 text-emerald-950">
                    إلى / {recipient || ' الجهة المعنية '}
                  </h3>
                  <h4 className="text-[14px] font-extrabold text-slate-800 mt-2">
                    م / تأييد درجات
                  </h4>
                </div>

                <div className="mt-4 px-2">
                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={4}
                    className="w-full text-xs leading-relaxed text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص مقدمة كتاب تأييد الدرجات..."
                  />
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-slate-400" dir="rtl">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 font-extrabold text-[11px]">
                        <th className="border border-slate-400 p-1 w-8 text-center">ت</th>
                        <th className="border border-slate-400 p-1 text-right">المادة</th>
                        <th className="border border-slate-400 p-1 w-16 text-center">الدرجة رقماً</th>
                        <th className="border border-slate-400 p-1 text-center">الدرجة كتابة</th>
                        <th className="border border-slate-400 p-1 text-center">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGradesList.map((gradeRow, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="border border-slate-400 p-1 text-center font-mono text-[10px]">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-right font-medium">{gradeRow.subject}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono font-bold text-emerald-950">
                            {gradeRow.score ?? '-'}
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-[11px]">
                            {gradeRow.score !== undefined ? arabicNumberToWords(gradeRow.score) : '-'}
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-[10px] text-slate-600 font-medium">
                            {gradeRow.score !== undefined ? (gradeRow.score >= 50 ? 'ناجح' : 'راسب') : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/50 font-extrabold text-[11px]">
                        <td className="border border-slate-400 p-1 text-center font-mono" colSpan={2}>المجموع</td>
                        <td className="border border-slate-400 p-1 text-center font-mono text-emerald-900">{totalScore}</td>
                        <td className="border border-slate-400 p-1 text-center" colSpan={2}>
                          {arabicNumberToWords(totalScore)} (مجموع درجات الطالب)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 px-2">
                  <textarea
                    value={closingBody}
                    onChange={(e) => setClosingBody(e.target.value)}
                    rows={2}
                    className="w-full text-xs leading-relaxed text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص خاتمة كتاب تأييد الدرجات..."
                  />
                </div>
              </div>
            ) : letterType === 'واقع_حال' ? (
              <div>
                <div className="text-center mt-4 mb-4">
                  <h3 className="text-[14px] font-bold underline underline-offset-4 text-emerald-950">
                    إلى / {recipient || ' الجهة المعنية '}
                  </h3>
                  <h4 className="text-[14px] font-extrabold text-slate-800 mt-1">
                    م / واقع حال طالب
                  </h4>
                </div>

                <div className="mt-2 px-2">
                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={4}
                    className="w-full text-xs leading-relaxed text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص مقدمة كتاب واقع الحال..."
                  />
                </div>

                <div className="mt-4">
                  <table className="w-full text-xs border-collapse border border-slate-400 text-center" dir="rtl">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 font-extrabold text-[11px]">
                        <th className="border border-slate-400 p-1 w-8">ت</th>
                        <th className="border border-slate-400 p-1 text-right">الصف</th>
                        <th className="border border-slate-400 p-1">العام الدراسي</th>
                        <th className="border border-slate-400 p-1">النتيجة</th>
                        <th className="border border-slate-400 p-1">الدور</th>
                        <th className="border border-slate-400 p-1">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timelineRows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-400 p-1 font-mono text-[10px]">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-right">
                            <input
                              type="text"
                              value={row.className}
                              onChange={(e) => {
                                const newRows = [...timelineRows];
                                newRows[idx].className = e.target.value;
                                setTimelineRows(newRows);
                              }}
                              className="w-full bg-transparent border-none text-right outline-none text-xs font-bold"
                              placeholder="..."
                            />
                          </td>
                          <td className="border border-slate-400 p-1">
                            <input
                              type="text"
                              value={row.year}
                              onChange={(e) => {
                                const newRows = [...timelineRows];
                                newRows[idx].year = e.target.value;
                                setTimelineRows(newRows);
                              }}
                              className="w-full bg-transparent border-none text-center outline-none text-xs font-mono"
                              placeholder="..."
                            />
                          </td>
                          <td className="border border-slate-400 p-1">
                            <input
                              type="text"
                              value={row.result}
                              onChange={(e) => {
                                const newRows = [...timelineRows];
                                newRows[idx].result = e.target.value;
                                setTimelineRows(newRows);
                              }}
                              className="w-full bg-transparent border-none text-center outline-none text-xs"
                              placeholder="..."
                            />
                          </td>
                          <td className="border border-slate-400 p-1">
                            <input
                              type="text"
                              value={row.attempt}
                              onChange={(e) => {
                                const newRows = [...timelineRows];
                                newRows[idx].attempt = e.target.value;
                                setTimelineRows(newRows);
                              }}
                              className="w-full bg-transparent border-none text-center outline-none text-xs"
                              placeholder="..."
                            />
                          </td>
                          <td className="border border-slate-400 p-1 text-slate-600">
                            <input
                              type="text"
                              value={row.notes}
                              onChange={(e) => {
                                const newRows = [...timelineRows];
                                newRows[idx].notes = e.target.value;
                                setTimelineRows(newRows);
                              }}
                              className="w-full bg-transparent border-none text-center outline-none text-[11px]"
                              placeholder="..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 px-2">
                  <textarea
                    value={closingBody}
                    onChange={(e) => setClosingBody(e.target.value)}
                    rows={3}
                    className="w-full text-xs leading-relaxed text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص خاتمة كتاب واقع الحال..."
                  />
                </div>
              </div>
            ) : letterType === 'قبول_طالب' ? (
              <div>
                <div className="text-center mt-8 mb-6">
                  <h3 className="text-[15px] font-bold underline underline-offset-4 text-emerald-950">
                    إلى / {recipient || ' جهة القبول المحترمون '}
                  </h3>
                  <h4 className="text-[14px] font-extrabold text-slate-800 mt-2">
                    م / قبول طالب
                  </h4>
                </div>

                <div className="mt-6 px-4">
                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={6}
                    className="w-full text-xs leading-loose text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص قبول الطالب..."
                  />
                </div>
              </div>
            ) : letterType === 'مباشرة_الهيئة' ? (
              <div>
                <div className="text-center mt-4 mb-4">
                  <h3 className="text-[14px] font-bold underline underline-offset-4 text-emerald-950">
                    إلى / {recipient || ' الجهة المعنية المحترمون '}
                  </h3>
                  <h4 className="text-[14px] font-extrabold text-slate-800 mt-1">
                    م / مباشرة
                  </h4>
                </div>

                <div className="mt-2 px-2">
                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={3}
                    className="w-full text-xs leading-relaxed text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص مقدمة كتاب المباشرة الجماعية..."
                  />
                </div>

                <div className="mt-4">
                  <table className="w-full text-xs border-collapse border border-slate-400 text-center" dir="rtl">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 font-extrabold text-[11px]">
                        <th className="border border-slate-400 p-1.5 w-8">ت</th>
                        <th className="border border-slate-400 p-1.5 text-right">الاسم الثلاثي</th>
                        <th className="border border-slate-400 p-1.5 w-36">العنوان الوظيفي</th>
                        <th className="border border-slate-400 p-1.5">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStaffList.length > 0 ? (
                        selectedStaffList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="border border-slate-400 p-1.5 font-mono text-[10px]">{idx + 1}</td>
                            <td className="border border-slate-400 p-1.5 text-right font-bold text-slate-900">{item.name}</td>
                            <td className="border border-slate-400 p-1.5 text-slate-600 font-semibold">{item.jobTitle}</td>
                            <td className="border border-slate-400 p-1.5 text-emerald-805 italic">{item.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="border border-slate-400 p-6 text-slate-405 italic text-[11px]" colSpan={4}>
                            يرجى تفعيل الخيارات الجانبية للمنتسبين أو المدرسين لإدراجهم في قائمة جدول الحضور فوراً.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 px-2">
                  <textarea
                    value={closingBody}
                    onChange={(e) => setClosingBody(e.target.value)}
                    rows={2}
                    className="w-full text-xs text-slate-800 font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-3 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="نص خاتمة كتاب المباشرة الجماعية..."
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mt-6 mb-4">
                  <h3 className="text-[14px] font-bold underline underline-offset-4 text-emerald-950">
                    إلى / {recipient || ' الجهة المعنون إليها الكتاب والمخاطبة المحترمون '}
                  </h3>
                  <h4 className="text-xs font-extrabold text-slate-500 mt-2">
                    الموضوع: ( {customSubject || 'غرض الكتاب الرسمي'} )
                  </h4>
                </div>

                <div className="mt-6 px-4">
                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={10}
                    className="w-full text-xs leading-loose text-slate-800 text-justify font-medium border border-dashed border-emerald-300/40 focus:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-4 outline-none resize-y transition-all focus:ring-1 focus:ring-emerald-500"
                    placeholder="اكتب أو عدل نص الكتاب هنا..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Core Footer Sign-off Exactly on LEFT block */}
          <div className="flex justify-between items-end mt-16 relative">
            <div className="text-slate-350 text-[10px] italic border border-dashed border-slate-200 rounded-xl w-24 h-24 flex items-center justify-center">
            </div>

            <div className="text-left flex flex-col items-center pl-4">
              <div className="font-extrabold text-xs text-slate-900 border-b border-slate-300 pb-0.5 mb-0.5 font-sans">
                {settings.principalName}
              </div>
              <div className="text-[10px] font-bold text-slate-500 font-sans">
                {settings.principalTitle}
              </div>
            </div>
          </div>

          <div className="text-center border-t border-dashed border-slate-200 pt-2.5 mt-8 flex flex-col gap-0.5">
          </div>

        </div>
      </div>

    </div>
  );
}
