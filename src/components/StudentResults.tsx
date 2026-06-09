/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Search, HelpCircle, FileCheck, RefreshCw, Printer } from 'lucide-react';
import { Student, SubjectKey, AppSettings } from '../types';
import { recalculateStudentGrades } from '../utils';

interface StudentResultsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  settings: AppSettings;
}

export function StudentResults({ students, setStudents, settings }: StudentResultsProps) {
  const [selectedClass, setSelectedClass] = useState<'الكل' | 'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي'>('الكل');
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | 'الكل'>('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'الكل' || student.className === selectedClass;
    const matchesSearch = student.name.includes(searchTerm) || student.classSection.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSubject, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSecondAttemptChange = (studentId: string, subjectKey: string, val: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      const numericVal = val === '' ? undefined : Number(val);
      if (numericVal !== undefined && (numericVal < 0 || numericVal > 100 || isNaN(numericVal))) {
        return student;
      }

      const updatedGrades = {
        ...student.grades,
        [subjectKey]: {
          ...student.grades[subjectKey],
          secondAttemptExam: numericVal
        }
      };

      const updatedStudent = {
        ...student,
        grades: updatedGrades
      };

      const activeSubjects = settings.allowedSubjects[student.className];
      return recalculateStudentGrades(updatedStudent, settings.decisionLimit, activeSubjects);
    }));
  };

  const renderedSubjects = selectedSubject !== 'الكل' 
    ? [selectedSubject] 
    : (selectedClass !== 'الكل' ? settings.allowedSubjects[selectedClass] : Object.values(SubjectKey));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center overflow-visible shrink-0 select-none">
            {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
              <div className="w-full h-full p-0.5 animate-fade-in" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
            ) : (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain animate-fade-in mix-blend-multiply filter contrast-125 hover:scale-105 transition-transform duration-200" referrerPolicy="no-referrer" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-900 mb-0.5">
              <Award className="h-5.5 w-5.5" />
              <h2 className="text-lg font-bold">شيت بيانات نتائج الطلاب المعتمدة الكلية</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">ملخص النتائج المعتمدة، درجات القرار، نتائج المكملين • إعداد وبرمجة: هيثم برزان الزيدي</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600 select-none">
          <RefreshCw className="h-4 w-4 animate-spin-slow text-indigo-600" />
          <span>مربوط تلقائياً مع شيت الدرجات الرئيسي</span>
        </div>
      </div>

      {/* Filtering dashboard */}
      <div className="bg-slate-50/50 rounded-2xl p-4.5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 font-sans">تصفية النتائج بالصف</label>
          <select
            value={selectedClass}
            onChange={(e: any) => {
              setSelectedClass(e.target.value);
              setSelectedSubject('الكل');
            }}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="الكل">كل المراحل الدراسية</option>
            <option value="الرابع العلمي">الرابع العلمي</option>
            <option value="الخامس العلمي">الخامس العلمي</option>
            <option value="السادس العلمي">السادس العلمي</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 font-sans">تصفية النتائج بالمادة</label>
          <select
            value={selectedSubject}
            onChange={(e: any) => setSelectedSubject(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="الكل">عرض ملخص جميع المواد</option>
            {Object.values(SubjectKey).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 font-sans">البحث عن طالب</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو الشعبة لرصد الدور الثاني..."
              className="block w-full rounded-xl border border-slate-200 bg-white pr-10 pl-3 py-2 text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner max-w-full overflow-x-auto">
        <table className="w-full text-slate-700 border-collapse text-xs select-text">
          <thead className="bg-[#f8faff] border-b border-indigo-100 text-[11px] font-bold text-indigo-950">
            <tr>
              <th className="py-3.5 px-3 text-right bg-indigo-50/50 sticky right-0 z-10 w-12 border-l border-indigo-100">تسلسل</th>
              <th className="py-3.5 px-4 text-right bg-indigo-50/50 sticky right-12 z-10 w-48 border-l border-indigo-100">اسم الطالب</th>
              <th className="py-3.5 px-3 text-center border-l border-indigo-100 bg-[#f8faff] font-sans">الصف والشعبة</th>
              
              {/* Dynamic Headers per subject */}
              {renderedSubjects.map((subKey) => (
                <th key={subKey} colSpan={9} className="text-center py-2 border-l border-indigo-150 bg-indigo-50/30 text-indigo-950 border-b border-indigo-100">
                  {subKey}
                </th>
              ))}
              
              <th className="py-3.5 px-4 text-center border-r border-[#f1f5f9] bg-indigo-50/50">النتيجة الكلية</th>
              <th className="py-3.5 px-3 text-center bg-indigo-50/50">دروس الإكمال والرسوب</th>
            </tr>
            <tr className="bg-[#fcfdfe] text-[9px] text-slate-500">
              <th className="py-1 bg-indigo-50/50 sticky right-0 z-10 border-l border-b border-indigo-100"></th>
              <th className="py-1 bg-indigo-50/50 sticky right-12 z-10 border-l border-b border-indigo-100"></th>
              <th className="py-1 border-l border-b border-indigo-100"></th>
              
              {renderedSubjects.map((subKey) => (
                <React.Fragment key={`sub-cols-${subKey}`}>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-slate-50">معدل ف1</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-slate-50">نصف السنة</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-slate-50">معدل ف2</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-indigo-50/20 font-bold">السعي</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-slate-50">النهائي</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-pink-50/10 font-bold">الدرجة</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-orange-50/10">القرار</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-pink-50/20 font-bold text-amber-900">امتحان د2</th>
                  <th className="py-1 px-1 border-l border-b border-slate-150 bg-indigo-50/10 font-semibold">مادة د2</th>
                </React.Fragment>
              ))}
              <th className="border-b border-indigo-100"></th>
              <th className="border-b border-indigo-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={renderedSubjects.length * 9 + 5} className="py-10 text-center text-slate-400 font-medium bg-slate-50">
                  لا يوجد طلاب مطابقين للتصفية الحالية.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const subKeys = settings.allowedSubjects[student.className];
                return (
                  <tr key={student.id} className="hover:bg-indigo-50/10 transition-all font-mono">
                    {/* Index */}
                    <td className="py-3 px-3 text-right font-bold text-slate-500 bg-indigo-50/20 sticky right-0 z-10 border-l border-indigo-100">
                      {student.seq}
                    </td>
                    
                    {/* Name */}
                    <td className="py-3 px-4 font-sans text-right font-bold text-slate-800 bg-indigo-50/10 sticky right-12 z-10 border-l border-indigo-100 truncate max-w-[180px]">
                      {student.name}
                    </td>

                    {/* Class & Section */}
                    <td className="py-3 px-3 text-center border-l border-indigo-100 font-sans">
                      <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{student.className} / {student.classSection}</span>
                    </td>

                    {/* Subject summary columns */}
                    {renderedSubjects.map((subKey) => {
                      const isAllowed = subKeys.includes(subKey);
                      const subGrades = student.grades[subKey] || {};
                      
                      if (!isAllowed) {
                        return (
                          <td key={`${student.id}-${subKey}`} colSpan={9} className="bg-slate-55 text-slate-400 text-center py-2.5 border-l border-slate-200 italic select-none">
                            محجوبة
                          </td>
                        );
                      }

                      const finalScore = subGrades.finalAfterDecision ?? subGrades.finalGrade;
                      const isFailed = finalScore !== undefined && finalScore < 50;

                      return (
                        <React.Fragment key={`${student.id}-${subKey}`}>
                          {/* avg1 */}
                          <td className="p-1 border-l border-slate-200 text-center text-slate-500">
                            {subGrades.avg1 ?? '-'}
                          </td>
                          {/* midyear */}
                          <td className="p-1 border-l border-slate-200 text-center text-slate-500">
                            {subGrades.midyear ?? '-'}
                          </td>
                          {/* avg2 */}
                          <td className="p-1 border-l border-slate-200 text-center text-slate-500">
                            {subGrades.avg2 ?? '-'}
                          </td>
                          {/* endeavor */}
                          <td className="p-1 border-l border-slate-200 text-center font-bold text-slate-800">
                            {subGrades.endeavor ?? '-'}
                          </td>
                          {/* finalExam */}
                          <td className="p-1 border-l border-slate-200 text-center text-slate-500">
                            {subGrades.finalExam ?? '-'}
                          </td>
                          {/* finalGrade / الدرجة النهائية */}
                          <td className={`p-1 border-l border-slate-200 text-center font-bold ${
                            isFailed ? 'text-rose-600 bg-rose-50/30' : 'text-emerald-700'
                          }`}>
                            {subGrades.finalAfterDecision ?? subGrades.finalGrade ?? '-'}
                          </td>
                          {/* decision applied */}
                          <td className={`p-1 border-l border-slate-200 text-center font-bold ${
                            subGrades.decisionApplied ? 'text-red-650 bg-red-50/50' : 'text-slate-400'
                          }`} style={subGrades.decisionApplied ? { color: '#dc2626' } : {}}>
                            {subGrades.decisionApplied ? `+${subGrades.decisionApplied}` : '-'}
                          </td>
                          {/* secondAttemptExam (editable for failed courses) */}
                          <td className={`p-0 border-l border-slate-200 text-center ${
                            isFailed ? 'bg-amber-50/50' : 'bg-slate-50/20'
                          }`}>
                            {isFailed ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={subGrades.secondAttemptExam ?? ''}
                                onChange={(e) => handleSecondAttemptChange(student.id, subKey, e.target.value)}
                                className="w-full h-8 text-center bg-transparent focus:bg-white outline-none font-bold text-amber-700 placeholder-amber-300"
                                placeholder="..."
                              />
                            ) : (
                              <span className="text-slate-350 select-none">-</span>
                            )}
                          </td>
                          {/* secondAttemptGrade */}
                          <td className={`p-1 border-l border-slate-200 text-center font-bold text-amber-800 ${
                            subGrades.secondAttemptGrade !== undefined ? (subGrades.secondAttemptGrade >= 50 ? 'bg-emerald-50/40 text-emerald-700' : 'bg-rose-50/40 text-rose-700') : ''
                          }`}>
                            {subGrades.secondAttemptGrade ?? '-'}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Overall Status */}
                    <td className="py-3 px-4 text-center font-bold border-r border-[#f1f5f9]">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        student.overallResult === 'ناجح' ? 'bg-emerald-100 text-emerald-800 border-emerald-200/50' :
                        student.overallResult === 'مكمل' ? 'bg-amber-100 text-amber-800 border border-amber-200/50' :
                        student.overallResult === 'راسب' ? 'bg-red-100 text-red-700 border-red-300 font-extrabold' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`} style={student.overallResult === 'راسب' ? { color: '#dc2626', backgroundColor: '#fee2e2', borderColor: '#fca5a5' } : {}}>
                        {student.overallResult}
                      </span>
                    </td>

                    {/* Incomplete list */}
                    <td className="py-3 px-3 text-center max-w-[130px] truncate" title={student.failedSubjectsList.join('، ')}>
                      <span className="text-[10px] font-sans font-bold text-slate-500">
                        {student.failedSubjectsList.length > 0 ? student.failedSubjectsList.join('، ') : 'بدون دروس متبقية'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 border-t border-slate-100 text-xs gap-3 select-none">
          <div className="text-slate-500 font-sans font-medium text-right">
            عرض {filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(filteredStudents.length, currentPage * itemsPerPage)} من {filteredStudents.length} طلاب
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 select-none">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-40 transition-all cursor-pointer font-bold font-sans active:scale-95"
              >
                السابق
              </button>
              <span className="font-mono text-slate-700 font-bold bg-slate-200/50 px-3 py-1 rounded-lg">
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-40 transition-all cursor-pointer font-bold font-sans active:scale-95"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
