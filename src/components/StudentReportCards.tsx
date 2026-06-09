/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Printer, Users, ChevronLeft, ChevronRight, FileText, Settings, CreditCard, Sparkles } from 'lucide-react';
import { Student, AppSettings } from '../types';

interface StudentReportCardsProps {
  students: Student[];
  settings: AppSettings;
}

export function StudentReportCards({ students, settings }: StudentReportCardsProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [isPrintAllMode, setIsPrintAllMode] = useState(false);

  const selectedStudentIndex = students.findIndex(s => s.id === selectedStudentId);
  const selectedStudent = students[selectedStudentIndex];

  const handlePrev = () => {
    if (selectedStudentIndex > 0) {
      setSelectedStudentId(students[selectedStudentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedStudentIndex < students.length - 1) {
      setSelectedStudentId(students[selectedStudentIndex + 1].id);
    }
  };

  const getCardHTML = (student: Student) => {
    const activeSubjects = settings.allowedSubjects[student.className as 'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي'] || [];
    const isFailedOverall = student.overallResult === 'راسب';
    const isIncompleteOverall = student.overallResult === 'مكمل';
    const isPassedOverall = student.overallResult === 'ناجح';

    const logoBackgroundHTML = settings.logoUrl 
      ? (settings.logoUrl.trim().startsWith('<svg') 
          ? settings.logoUrl 
          : `<img src="${settings.logoUrl}" alt="Logo Background" class="original-logo w-full h-full object-contain filter grayscale" style="mix-blend-mode: multiply;" />`) 
      : '';

    const logoHeaderHTML = settings.logoUrl 
      ? (settings.logoUrl.trim().startsWith('<svg') 
          ? settings.logoUrl 
          : `<img src="${settings.logoUrl}" alt="Logo" class="original-logo w-full h-full object-contain filter contrast-125" style="mix-blend-mode: multiply;" />`) 
      : '';



    const tableRowsHTML = activeSubjects.map((subKey, index) => {
      const subGrades = student.grades[subKey] || {};
      const finalGradeVal = subGrades.finalAfterDecision ?? subGrades.finalGrade;
      const bgClass = index % 2 === 0 ? 'bg-slate-50/40' : 'bg-white';
      
      let resultBadgeColor = 'text-slate-500';
      if (subGrades.result === 'راسب') {
        resultBadgeColor = 'text-red-600 bg-red-50/20';
      } else if (subGrades.result === 'ناجح') {
        resultBadgeColor = 'text-emerald-700';
      }

      return `
        <tr class="${bgClass}">
          <td class="text-right font-sans font-bold text-slate-900 border border-slate-200" style="text-align: right; padding: 1.5px 4px; font-size: 8px; line-height: 1;">
            ${subKey}
          </td>
          <td class="border border-slate-200 font-mono" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.avg1 ?? '-'}</td>
          <td class="border border-slate-200 font-mono" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.midyear ?? '-'}</td>
          <td class="border border-slate-200 font-mono" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.avg2 ?? '-'}</td>
          <td class="border border-slate-200 font-semibold font-mono" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.endeavor ?? '-'}</td>
          <td class="border border-slate-200 font-mono" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.finalExam ?? '-'}</td>
          <td class="border border-slate-200 font-bold font-mono text-emerald-850 bg-emerald-55/5" style="color: #047857; background-color: rgba(16, 185, 129, 0.05); padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">${subGrades.finalGrade ?? '-'}</td>
          <td class="border border-slate-200 text-red-600 font-bold font-mono" style="color: #dc2626; padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">
            ${subGrades.decisionApplied ? `+${subGrades.decisionApplied}` : '-'}
          </td>
          <td class="border border-slate-200 font-bold font-mono text-red-700" style="color: #b91c1c; padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center;">
            ${subGrades.secondAttemptGrade ?? (subGrades.secondAttemptExam ?? '-')}
          </td>
          <td class="font-bold border border-slate-200 ${resultBadgeColor}" style="padding: 1.5px 2px; font-size: 8px; line-height: 1; text-align: center; color: ${subGrades.result === 'راسب' ? '#dc2626' : (subGrades.result === 'ناجح' ? '#047857' : '#64748b')}; font-weight: ${subGrades.result === 'راسب' ? '950' : 'bold'};">
            ${subGrades.result || 'مستمر'}
          </td>
        </tr>
      `;
    }).join('');

    const statusBadgeClass = isPassedOverall ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
      isIncompleteOverall ? 'bg-amber-100 text-amber-805 border border-amber-200' :
      student.overallResult === 'مستمر' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-rose-100 text-rose-800 border border-rose-200';

    const failedSubjectsSection = student.failedSubjectsList.length > 0
      ? `<div class="text-[8px] leading-relaxed text-rose-750 font-sans border-r-2 border-rose-300 pr-1 py-0.5" style="border-right-color: #fca5a5; color: #9f1239; border-right-width: 2px;">
           <span class="font-semibold text-rose-900" style="color: #831843;">دروس الإكمال والرسوب:</span> ${student.failedSubjectsList.join('، ')}
         </div>`
      : '';

    return `
      <div class="bg-white border-[3px] border-double border-emerald-900 p-4 rounded-lg text-slate-800 flex flex-col justify-between relative shadow-md font-sans leading-tight shrink-0 select-none" style="page-break-inside: avoid; break-inside: avoid; border-color: #064e3b; width: 140mm; min-height: 120mm; height: auto; box-sizing: border-box; background: white; border-style: double; padding-bottom: 12px;">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0" style="opacity: 0.03; position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
          <div class="w-48 h-48 flex items-center justify-center overflow-hidden">
            ${logoBackgroundHTML}
          </div>
        </div>

        <div class="border-b border-dashed border-emerald-900 pb-1 mb-1 relative z-10 flex justify-between items-start text-xs" style="border-bottom-color: #064e3b; border-bottom-width: 1px; border-bottom-style: dashed; display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="text-right" dir="rtl" style="text-align: right;">
            <div style="display: inline-flex; flex-direction: column; align-items: center; text-align: center; font-family: 'Cairo', sans-serif;">
              <span style="font-size: 8px; color: #047857; font-weight: bold; margin-bottom: 2px; line-height: 1;">إدارة</span>
              <span style="font-size: 11px; font-weight: 850; color: #022c22; line-height: 1.2;">${settings.schoolName}</span>
            </div>
          </div>

          <div class="flex flex-col items-center" style="display: flex; flex-direction: column; align-items: center;">
            <div class="w-16 h-16 flex items-center justify-center overflow-visible select-none">
              ${logoHeaderHTML}
            </div>
            <h4 class="font-extrabold text-emerald-955 text-[9px] mt-0.5 tracking-tight font-sans" style="color: #022c22; font-weight: 800;">نتيجة درجات الطالب</h4>
          </div>

          <div class="text-left text-[8.5px] text-slate-500 font-mono" style="text-align: left; font-size: 8.5px; color: #64748b;">
            <div>الرقم: ${student.seq}/م</div>
            <div>العام الدراسي: ${settings.currentAcademicYear}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 bg-slate-50 p-1.5 rounded-md border border-slate-200/50 text-[9.5px] mb-1 relative z-10 font-sans w-full" style="display: grid; grid-template-columns: 1fr 1fr; background-color: #f8fafc; border-color: rgba(226, 232, 240, 0.5); border-width: 1px; border-style: solid; padding: 4px 6px; border-radius: 6px;">
          <div class="text-right pr-2 border-l border-slate-200" style="border-left-width: 1px; border-left-color: #e2e8f0; border-left-style: solid; text-align: right; padding-right: 8px;">
            <span class="text-slate-500 font-semibold" style="color: #64748b;">اسم الطالب:</span> 
            <strong class="text-slate-900 font-bold" style="color: #0f172a; font-weight: bold;">${student.name}</strong>
          </div>
          <div class="text-right pr-3" style="text-align: right; padding-right: 12px;">
            <span class="text-slate-500 font-semibold" style="color: #64748b;">الصف والشعبة:</span> 
            <strong class="text-slate-900 font-bold" style="color: #0f172a; font-weight: bold;">${student.className} / ${student.classSection}</strong>
          </div>
        </div>

        <div class="flex-1 overflow-visible relative z-10">
          <table class="w-full text-[8.5px] border-collapse" dir="rtl" style="width: 100%; font-size: 8.5px; border-collapse: collapse;">
            <thead class="bg-emerald-800 text-white font-extrabold" style="background-color: #065f46; color: white;">
              <tr>
                <th class="border border-emerald-900" style="border-color: #064e3b; text-align: right; padding: 2px 4px;">المادة الدراسية</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">معدل ف1</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">نصف السنة</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">معدل ف2</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">السعي</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">النهائي</th>
                <th class="border border-emerald-900 font-bold text-center" style="border-color: #064e3b; font-weight: bold; padding: 2px 2px; text-align: center;">الدور الأول</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">درجة القرار</th>
                <th class="border border-emerald-900 text-center" style="border-color: #064e3b; padding: 2px 2px; text-align: center;">الدور الثاني</th>
                <th class="border border-emerald-900 font-bold text-center" style="border-color: #064e3b; font-weight: bold; padding: 2px 2px; text-align: center;">النتيجة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 divide-dotted text-center font-mono text-slate-800" style="text-align: center;">
              ${tableRowsHTML}
            </tbody>
          </table>
        </div>

        <div class="border-t border-slate-200 pt-1.5 mt-1.5 flex justify-between items-end relative z-10 text-[9.5px]" style="border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; display: flex; justify-content: space-between; align-items: flex-end;">
          <div class="flex flex-col gap-0.5 w-2/3" style="display: flex; flex-direction: column; gap: 2px; width: 66.666%; text-align: right;">
            <div class="flex items-center gap-1" style="display: flex; align-items: center; gap: 4px;">
              <span class="text-slate-500" style="color: #64748b;">حالة النتيجة الإجمالية:</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-extrabold ${statusBadgeClass}" style="padding: 1px 6px; border-radius: 4px; font-weight: 800; font-size: 8px; background-color: ${student.overallResult === 'راسب' ? '#fee2e2' : (student.overallResult === 'ناجح' ? '#d1fae5' : (student.overallResult === 'مكمل' ? '#fef3c7' : '#f1f5f9'))}; color: ${student.overallResult === 'راسب' ? '#dc2626' : (student.overallResult === 'ناجح' ? '#065f46' : (student.overallResult === 'مكمل' ? '#b45309' : '#334155'))}; border: 1px solid ${student.overallResult === 'راسب' ? '#fca5a5' : (student.overallResult === 'ناجح' ? '#6ee7b7' : (student.overallResult === 'مكمل' ? '#fcd34d' : '#cbd5e1'))};">
                ${student.overallResult}
              </span>
            </div>
            
            ${failedSubjectsSection}
          </div>

          <div class="text-left flex flex-col items-center" style="display: flex; flex-direction: column; align-items: center; transform: translateY(-20px); position: relative;">
            <span class="text-[7.5px] text-slate-400 mb-2" style="color: #94a3b8; font-size: 7.5px; margin-bottom: 4px;">توقيع الختم الرسمي للجنة المدرسية</span>
            <div class="font-sans font-bold text-emerald-900 text-[9px]" style="text-decoration: underline; font-weight: bold; color: #064e3b; font-size: 9px;">
              ${settings.principalName}
            </div>
            <div class="text-[7.5px] text-slate-500 font-semibold" style="color: #64748b; font-size: 7.5px; font-weight: 600;">${settings.principalTitle}</div>
          </div>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error("Popup blocked");
      }

      const studentsToPrint = isPrintAllMode 
        ? students 
        : ([selectedStudent].filter(Boolean) as Student[]);

      if (studentsToPrint.length === 0) {
        alert("لا يوجد طلاب محددين للطباعة.");
        return;
      }

      // Pair students side-by-side for landscape double display
      const pairs: [Student, Student | null][] = [];
      for (let i = 0; i < studentsToPrint.length; i += 2) {
        pairs.push([studentsToPrint[i], studentsToPrint[i + 1] || null]);
      }

      const rowsHTML = pairs.map(([st1, st2]) => {
        const leftCard = getCardHTML(st1);
        const rightCard = st2 
          ? getCardHTML(st2)
          : `<div class="w-[140mm] h-[120mm] rounded-lg border border-dashed border-slate-350 flex items-center justify-center text-slate-400 text-xs italic bg-slate-50/50 print:hidden select-none" style="width: 140mm; height: 120mm; border: 1.5px dashed #cbd5e1; background-color: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-style: italic;">نهاية قائمة درجات الطلاب</div>`;

        return `
          <div class="page-break">
            ${leftCard}
            ${rightCard}
          </div>
        `;
      }).join('');

      const schoolTitle = settings.schoolName;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>طباعة بطاقات المخرجات - ${schoolTitle}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              padding: 0;
              margin: 0;
              background-color: #f1f5f9;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @media print {
              body {
                background-color: white !important;
                background: white !important;
              }
              
              .no-print {
                display: none !important;
              }

              @page {
                size: A4 landscape;
                margin: 0 !important;
              }

              .page-break {
                page-break-after: always;
                break-after: page;
                margin: 0 !important;
                padding-top: 15mm !important;
                padding-bottom: 15mm !important;
                height: 100vh !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: row !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 15mm !important;
                background-color: white !important;
              }
            }

            .page-break {
              margin-bottom: 2.5rem;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 20px;
              padding: 24px;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              max-width: fit-content;
              margin-left: auto;
              margin-right: auto;
            }

            .original-logo {
              max-height: 100%;
              max-width: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body class="bg-slate-100 p-6 md:p-12">
          <!-- Interactive options panel -->
          <div class="no-print max-w-5xl mx-auto mb-8 bg-emerald-900 border border-emerald-800 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-right">
              <h2 class="text-lg font-bold mb-1">معاينة طباعة بطاقات درجات الطلاب 🖨️</h2>
              <p class="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
                تم تجهيز المستندات بالحجم القياسي المناسب لأوراق <strong>A4 الأفقية (A4 Landscape)</strong>. يتم ترتيب بطاقتين في كل مستند تلقائياً لتوفير الورق والحصول على منظر رائع.
              </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button onclick="window.close()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer">
                إغلاق
              </button>
              <button onclick="window.print()" class="px-6 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer">
                بدء الطباعة الآن
              </button>
            </div>
          </div>

          <!-- Printable Container of all pairs -->
          <div class="flex flex-col gap-6">
            ${rowsHTML}
          </div>

          <script>
            // Automatically prompt print dialog when fully rendered
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 600);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      console.warn("Popup blocked or standard sandbox protection. Falling back to direct window.print", e);
      alert(
        "تنبيه: قد يقوم المتصفح بحظر النوافذ المنبثقة للطباعة التلقائية من داخل هذا الإطار المدمج. للحصول على أفضل مظهر للطباعة وتنسيق مثالي، يرجى الضغط على زر 'الفتح في تبويب جديد' بالركن العلوي للمتصفح لتفتح المنصة بشكل كامل ومستقل، أو اضغط على (Ctrl + P) أو (Cmd + P) للطباعة المباشرة."
      );
      try {
        window.print();
      } catch (err) {
        console.error("Direct printing fallback failed:", err);
      }
    }
  };

  const studentPairs: [Student, Student | null][] = [];
  for (let i = 0; i < students.length; i += 2) {
    studentPairs.push([students[i], students[i + 1] || null]);
  }

  const ResultCard = ({ student }: { student: Student }) => {
    const activeSubjects = settings.allowedSubjects[student.className] || [];
    
    const isFailedOverall = student.overallResult === 'راسب';
    const isIncompleteOverall = student.overallResult === 'مكمل';
    const isPassedOverall = student.overallResult === 'ناجح';

    return (
      <div className="bg-white border-[3px] border-double border-emerald-900 p-5 rounded-lg text-slate-800 flex flex-col justify-between min-h-[120mm] h-auto w-[140mm] relative shadow-md font-sans leading-tight pb-4">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
          <div className="w-56 h-56 flex items-center justify-center overflow-hidden">
            {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
              <div className="w-full h-full p-2" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
            ) : (
              <img src={settings.logoUrl} alt="Logo Background" className="w-full h-full object-contain filter grayscale" referrerPolicy="no-referrer" />
            )}
          </div>
        </div>

        <div className="border-b border-dashed border-emerald-900 pb-2 mb-2 relative z-10 flex justify-between items-start text-xs">
          <div className="text-right" dir="rtl">
            <div className="inline-flex flex-col items-center text-center font-sans">
              <span className="text-[8px] text-emerald-805 font-bold mb-0.5 leading-none">إدارة</span>
              <span className="text-[11px] font-extrabold text-emerald-955 leading-tight">{settings.schoolName}</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center overflow-visible select-none">
              {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
                <div className="w-full h-full p-0.5" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
              ) : (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain mix-blend-multiply filter contrast-125" referrerPolicy="no-referrer" />
              )}
            </div>
            <h4 className="font-extrabold text-emerald-955 text-[10px] mt-0.5 tracking-tight font-sans">نتيجة درجات الطالب</h4>
          </div>

          <div className="text-left text-[9px] text-slate-500 font-mono">
            <div>الرقم: {student.seq}/م</div>
            <div>العام الدراسي: {settings.currentAcademicYear}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 bg-slate-50 p-2 rounded-md border border-slate-200/50 text-[10px] mb-2 relative z-10 font-sans w-full">
          <div className="text-right pr-1 border-l border-slate-200">
            <span className="text-slate-500 font-semibold">اسم الطالب:</span>{' '}
            <strong className="text-slate-905 font-bold">{student.name}</strong>
          </div>
          <div className="text-right pr-3">
            <span className="text-slate-500 font-semibold">الصف والشعبة:</span>{' '}
            <strong className="text-slate-905 font-bold">{student.className} / {student.classSection}</strong>
          </div>
        </div>

        <div className="flex-1 overflow-visible relative z-10">
          <table className="w-full text-[9px] border-collapse" dir="rtl">
            <thead className="bg-emerald-800 text-white font-extrabold text-[9px]">
              <tr>
                <th className="py-1 px-1.5 text-right border border-emerald-900">المادة الدراسية</th>
                <th className="py-1 px-1 text-center border border-emerald-900">معدل ف1</th>
                <th className="py-1 px-1 text-center border border-emerald-900">نصف السنة</th>
                <th className="py-1 px-1 text-center border border-emerald-900">معدل ف2</th>
                <th className="py-1 px-1 text-center border border-emerald-900">السعي</th>
                <th className="py-1 px-1 text-center border border-emerald-900">النهائي</th>
                <th className="py-1 px-1 text-center border border-emerald-900 font-bold">الدور الأول</th>
                <th className="py-1 px-1 text-center border border-emerald-900">درجة القرار</th>
                <th className="py-1 px-1 text-center border border-emerald-900">الدور الثاني</th>
                <th className="py-1 px-1 text-center border border-emerald-900 font-bold">النتيجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 divide-dotted text-center font-mono text-slate-800">
              {activeSubjects.map((subKey, index) => {
                const subGrades = student.grades[subKey] || {};
                const finalGradeVal = subGrades.finalAfterDecision ?? subGrades.finalGrade;
                const isSubFail = finalGradeVal !== undefined && finalGradeVal < 50;

                return (
                  <tr key={subKey} className={index % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="py-0.5 px-1.5 text-right font-sans font-bold text-slate-900 border border-slate-200">
                      {subKey}
                    </td>
                    <td className="py-0.5 border border-slate-200">{subGrades.avg1 ?? '-'}</td>
                    <td className="py-0.5 border border-slate-200">{subGrades.midyear ?? '-'}</td>
                    <td className="py-0.5 border border-slate-200">{subGrades.avg2 ?? '-'}</td>
                    <td className="py-0.5 border border-slate-200 font-semibold">{subGrades.endeavor ?? '-'}</td>
                    <td className="py-0.5 border border-slate-200">{subGrades.finalExam ?? '-'}</td>
                    <td className="py-0.5 border border-slate-200 font-bold text-emerald-850 bg-emerald-55/5">
                      {subGrades.finalGrade ?? '-'}
                    </td>
                    <td className={`py-0.5 border border-slate-200 font-bold ${subGrades.decisionApplied ? 'text-red-650 bg-red-50/50' : 'text-slate-400'}`} style={subGrades.decisionApplied ? { color: '#dc2626' } : {}}>
                      {subGrades.decisionApplied ? `+${subGrades.decisionApplied}` : '-'}
                    </td>
                    <td className="py-0.5 border border-slate-200 font-bold text-red-700">
                      {subGrades.secondAttemptGrade ?? (subGrades.secondAttemptExam ?? '-')}
                    </td>
                    <td className={`py-0.5 font-bold border border-slate-200 ${
                      subGrades.result === 'راسب' ? 'text-red-600 bg-red-50/30' :
                      subGrades.result === 'ناجح' ? 'text-emerald-700 animate-fade-in' : 'text-slate-500'
                    }`} style={subGrades.result === 'راسب' ? { color: '#dc2626' } : {}}>
                      {subGrades.result || 'مستمر'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 pt-2.5 mt-2.5 flex justify-between items-end relative z-10 text-[10px]">
          <div className="flex flex-col gap-1 w-2/3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">حالة النتيجة الإجمالية:</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                isPassedOverall ? 'bg-emerald-100 text-emerald-800 border-emerald-250' :
                isIncompleteOverall ? 'bg-amber-100 text-amber-800 border-amber-250' :
                student.overallResult === 'مستمر' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                student.overallResult === 'راسب' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-700'
              }`} style={student.overallResult === 'راسب' ? { color: '#dc2626', backgroundColor: '#fee2e2', borderColor: '#fca5a5' } : {}}>
                {student.overallResult}
              </span>
            </div>
            
            {student.failedSubjectsList.length > 0 && (
              <div className="text-[9px] leading-relaxed text-rose-750 font-sans border-r-2 border-rose-300 pr-1.5 py-0.5">
                <span className="font-semibold text-rose-900">دروس الإكمال والرسوب:</span>{' '}
                {student.failedSubjectsList.join('، ')}
              </div>
            )}
          </div>

          <div className="text-left flex flex-col items-center -translate-y-5 relative">
            <span className="text-[8px] text-slate-400 mb-5">توقيع الختم الرسمي للجنة المدرسية</span>
            <div className="font-sans font-bold text-emerald-900 text-[10px]" style={{ textDecoration: 'underline' }}>
              {settings.principalName}
            </div>
            <div className="text-[8px] text-slate-500 font-semibold">{settings.principalTitle}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Interaction Controls Panel - Hidden on printed versions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-1">
              <CreditCard className="h-6 w-6" />
              <h2 className="text-xl font-bold">نتائج الطلاب وتقرير الدرجات (البطاقة المدرسية)</h2>
            </div>
            <p className="text-xs text-slate-400">توليد وصياغة وطباعة نتائج طلاب المدرسة بمظهر احترافي ومناسب لأوراق A4</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
               onClick={() => setIsPrintAllMode(!isPrintAllMode)}
               className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border outline-none cursor-pointer ${
                 isPrintAllMode 
                   ? 'bg-slate-800 text-white border-slate-800' 
                   : 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200/50 text-indigo-700'
               }`}
            >
              <Users className="h-4 w-4" />
              {isPrintAllMode ? 'العودة لمعاينة طالب واحد' : 'عرض وطباعة بطاقات جميع الطلاب (١٨٠٠ طالب)'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-700/10 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              طباعة بطاقات المخرجات
            </button>
          </div>
        </div>

        {!isPrintAllMode && (
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 rounded-2xl p-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">معاينة الطالب:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="block w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 select-none">
              <button
                onClick={handlePrev}
                disabled={selectedStudentIndex <= 0}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-600">
                الطالب {selectedStudentIndex + 1} من {students.length}
              </span>
              <button
                onClick={handleNext}
                disabled={selectedStudentIndex >= students.length - 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Styles for Print layout alignment */}
      <style>{`
        @media print {
          /* Hide non-print areas completely */
          header, footer, aside, .print\\:hidden, [class*="print:hidden"] {
            display: none !important;
          }

          /* Ensure all wrappers expand fully and remove layout constraints during print */
          html, body, #root, .min-h-screen, main, .print-container {
            background: white !important;
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Overwrite the layout columns from App.tsx */
          div[class*="flex-col lg:flex-row"] {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Setup A4 Landscape printing precisely */
          @page {
            size: A4 landscape;
            margin: 0 !important;
          }

          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Scale card up in single preview mode during printing */
          .print-single-card {
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .page-break {
            page-break-after: always;
            break-after: page;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-top: 15mm !important; /* Visual padding for A4 landscape top */
            padding-bottom: 15mm !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 15mm !important;
            width: 100% !important;
            height: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* Document Printing Sheet Container */}
      <div className="print-container flex flex-col items-center justify-center gap-6 p-4">
        {!isPrintAllMode ? (
          selectedStudent ? (
            /* Render single student report preview centered */
            <div className="flex justify-center w-full print-single-card">
              <ResultCard student={selectedStudent} />
            </div>
          ) : (
            <div className="text-center text-slate-400 py-10 bg-slate-50 w-full rounded-2xl border border-slate-100">
              يرجى إضافة طالب أولاً لخدمة كارتات النتائج.
            </div>
          )
        ) : (
          /* Render ALL 400+ students, pairing two students in each landscape page row */
          <div className="space-y-8 w-full flex flex-col items-center">
            {studentPairs.map(([student1, student2], pageIndex) => (
              <div 
                key={`page-${pageIndex}`} 
                className="page-break flex flex-col md:flex-row gap-5 items-center justify-center p-2 border-b border-indigo-100 print:border-b-0 pb-6 print:pb-0 w-full"
              >
                {/* Left Card Slot */}
                <ResultCard student={student1} />

                {/* Right Card Slot */}
                {student2 ? (
                  <ResultCard student={student2} />
                ) : (
                  /* Placeholder to keep layout symmetrical on final odd student */
                  <div className="w-[140mm] h-[120mm] rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-350 text-xs italic bg-slate-50/50 print:hidden select-none">
                    نهاية سجل درجات المحاضرين
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
