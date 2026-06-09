/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, User, Award, CheckCircle, HelpCircle, Briefcase, FileSpreadsheet, Compass, ShieldAlert } from 'lucide-react';
import { Student, Teacher, Staff, ScheduleAllocation, SubjectKey, StudentType } from '../types';
import { calculateActiveService } from '../utils';

interface SearchSystemProps {
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  allocations: ScheduleAllocation[];
}

export function SearchSystem({ students, teachers, staff, allocations }: SearchSystemProps) {
  const [query, setQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<{ id: string; type: 'طالب' | 'مدرس' | 'موظف' } | null>(null);

  // Global search matches
  const matchedStudents = query.trim() ? students.filter(s => s.name.includes(query)) : [];
  const matchedTeachers = query.trim() ? teachers.filter(t => t.name.includes(query) || t.specialty.includes(query)) : [];
  const matchedStaff = query.trim() ? staff.filter(s => s.name.includes(query) || s.jobTitle.includes(query)) : [];

  const handleSelectResult = (id: string, type: 'طالب' | 'مدرس' | 'موظف') => {
    setSelectedResult({ id, type });
  };

  // Get active selected object
  const getSelectedData = () => {
    if (!selectedResult) return null;
    if (selectedResult.type === 'طالب') {
      return students.find(s => s.id === selectedResult.id);
    }
    if (selectedResult.type === 'مدرس') {
      return teachers.find(t => t.id === selectedResult.id);
    }
    return staff.find(s => s.id === selectedResult.id);
  };

  const selectedData = getSelectedData();

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-emerald-850 mb-1 flex items-center gap-1.5 font-sans">
          <Search className="h-5.5 w-5.5 animate-pulse-slow text-emerald-700" />
          البحث الشامل والمطابقة عن الطلاب والكادر
        </h2>
        <p className="text-xs text-slate-400">محرك بحث ذكي مستقل يبحث بجميع القيود ويعرض البطاقة الشخصية التفصيلية وكشف الدرجات والمحاضرات</p>
        
        {/* Search input field */}
        <div className="relative mt-5">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedResult(null); // clear detail layout on new queries
            }}
            placeholder="ابحث بكتابة اسم الطالب، المدرس، الموظف، أو الاختصاص التعليمي..."
            className="w-full text-xs py-3 pr-11 pl-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:bg-slate-50/20 transition-all font-sans"
          />
          <Search className="absolute right-4 top-3.5 h-4 w-4 text-emerald-700" />
        </div>
      </div>

      {query.trim() && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Results Selection List */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-xs font-sans">
            <h3 className="font-extrabold text-slate-550 border-b border-slate-100 pb-2 mb-3">نتائج البحث المتطابقة</h3>
            
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {matchedStudents.length === 0 && matchedTeachers.length === 0 && matchedStaff.length === 0 && (
                <div className="text-center text-slate-400 py-6">لا توجد نتائج مطابقة لبحثك.</div>
              )}

              {/* Students matched list */}
              {matchedStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleSelectResult(student.id, 'طالب')}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                    selectedResult?.id === student.id ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-slate-800">{student.name}</span>
                    <span className="text-[10px] text-slate-400">{student.className}</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md">طالب</span>
                </button>
              ))}

              {/* Teachers matched list */}
              {matchedTeachers.map(teacher => (
                <button
                  key={teacher.id}
                  onClick={() => handleSelectResult(teacher.id, 'مدرس')}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                    selectedResult?.id === teacher.id ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-slate-800">{teacher.name}</span>
                    <span className="text-[10px] text-indigo-650">{teacher.specialty} • {teacher.jobTitle}</span>
                  </div>
                  <span className="bg-orange-50 text-orange-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md">مدرس</span>
                </button>
              ))}

              {/* Staff matched list */}
              {matchedStaff.map(person => (
                <button
                  key={person.id}
                  onClick={() => handleSelectResult(person.id, 'موظف')}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                    selectedResult?.id === person.id ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-slate-800">{person.name}</span>
                    <span className="text-[10px] text-indigo-650">{person.jobTitle} • {person.qualification}</span>
                  </div>
                  <span className="bg-amber-50 text-amber-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md">موظف</span>
                </button>
              ))}
            </div>

          </div>

          {/* Result Comprehensive Portfolio Details */}
          <div className="lg:col-span-8">
            {selectedData ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 font-sans">
                
                {/* 1. Portfolio Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-slate-900">{selectedData.name}</h3>
                      <p className="text-[10px] text-slate-400">
                        {selectedResult?.type} • الهوية الوطنية: {selectedData.nationalId || 'مرفقة بالمستند'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedResult?.type === 'طالب' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-800'
                  }`}>
                    ملف {selectedResult?.type} كامل
                  </span>
                </div>

                {/* 2. Portfolio Fields Layout (Students list) */}
                {selectedResult?.type === 'طالب' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">الصف والمرحلة:</span>
                        <strong className="text-slate-800">{(selectedData as Student).className}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">الشعبة والمجموعة:</span>
                        <strong className="text-slate-800">الشعبة {(selectedData as Student).classSection}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">تاريخ التولد:</span>
                        <strong className="text-slate-800 font-mono">{(selectedData as Student).dob}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">سنوات الرسوب المسبقة:</span>
                        <strong className="text-slate-800 font-mono">{(selectedData as Student).failureYears} سنة</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">حالة اليتم:</span>
                        <strong className="text-slate-800">{(selectedData as Student).isOrphan ? 'يتيم الأب/الأم' : 'كلا الأبوين على قيد الحياة'}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">العنوان الشخصي:</span>
                        <strong className="text-slate-800">{(selectedData as Student).address}</strong>
                      </div>
                      
                      <div className={`p-3 rounded-xl border ${
                        (selectedData as Student).hasDisease ? 'bg-red-50/50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-200/50'
                      }`}>
                        <span className="text-slate-400 block mb-0.5 font-bold">الحالة الصحية:</span>
                        <strong className="font-semibold">
                          {(selectedData as Student).hasDisease ? `يعاني من: ${(selectedData as Student).diseaseType}` : 'سليم معافى'}
                        </strong>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        (selectedData as Student).canStudyThisYear ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-rose-50/50 border-rose-200 text-rose-800'
                      } sm:col-span-2`}>
                        <span className="text-slate-400 block mb-0.5 font-bold">حق وطبيعة الدوام هذا العام:</span>
                        <strong className="font-semibold text-[11px]">
                          {(selectedData as Student).canStudyThisYear 
                            ? 'مستمر ومصرح له بالدوام الصباحي قانوناً' 
                            : `غير مصرح له بالدوام الصباحي. المسبب: ${(selectedData as Student).cannotStudyReason}`}
                        </strong>
                      </div>
                    </div>

                    {/* Studnet Grades List Table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden max-w-full overflow-x-auto shadow-inner">
                      <table className="w-full text-slate-700 border-collapse text-xs select-text text-center">
                        <thead className="bg-[#fbfcff] border-b border-slate-150 text-[10px] font-bold">
                          <tr>
                            <th className="py-2.5 px-3 text-right bg-slate-50">المادة الدراسية</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">سعى ف1</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">نصف السنة</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">سعى ف2</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">السعي السنوي</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">النهائي</th>
                            <th className="py-2.5 px-1 border-r border-slate-100 font-bold text-emerald-950 bg-emerald-50/10">الدور الأول</th>
                            <th className="py-2.5 px-1 border-r border-slate-100 font-bold bg-indigo-50/30">درجة القرار</th>
                            <th className="py-2.5 px-1 border-r border-slate-100">الدور الثاني</th>
                            <th className="py-2.5 px-2 border-r border-slate-100 font-bold">النتيجة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {Object.entries((selectedData as Student).grades).map(([subKey, subGrades]) => {
                            const finalGradeVal = subGrades.finalAfterDecision ?? subGrades.finalGrade;
                            return (
                              <tr key={subKey} className="hover:bg-slate-50/20">
                                <td className="py-1 px-3 text-right font-sans font-bold text-slate-800">{subKey}</td>
                                <td className="py-1 border-r border-slate-100 text-slate-500">{subGrades.avg1 ?? '-'}</td>
                                <td className="py-1 border-r border-slate-100 text-slate-500">{subGrades.midyear ?? '-'}</td>
                                <td className="py-1 border-r border-slate-100 text-slate-500">{subGrades.avg2 ?? '-'}</td>
                                <td className="py-1 border-r border-slate-100 font-bold text-slate-800">{subGrades.endeavor ?? '-'}</td>
                                <td className="py-1 border-r border-slate-100 text-slate-500">{subGrades.finalExam ?? '-'}</td>
                                <td className="py-1 border-r border-slate-100 font-extrabold text-emerald-800 bg-emerald-50/10">{subGrades.finalGrade ?? '-'}</td>
                                <td className={`py-1 border-r border-slate-100 font-extrabold ${subGrades.decisionApplied ? 'text-red-650 bg-red-50/20' : 'text-slate-400'}`} style={subGrades.decisionApplied ? { color: '#dc2626' } : {}}>
                                  {subGrades.decisionApplied ? `+${subGrades.decisionApplied}` : '-'}
                                </td>
                                <td className="py-1 border-r border-slate-100 text-red-600 font-semibold">{subGrades.secondAttemptGrade ?? (subGrades.secondAttemptExam ?? '-')}</td>
                                <td className="py-1 border-r border-slate-100 font-bold">
                                  {finalGradeVal !== undefined ? (
                                    finalGradeVal >= 50 ? (
                                      <span className="text-emerald-700">ناجح</span>
                                    ) : (
                                      <span className="text-red-600 font-black" style={{ color: '#dc2626' }}>راسب</span>
                                    )
                                  ) : 'مستمر'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Portfolio Fields Layout (Teachers/Staff list) */}
                {(selectedResult?.type === 'مدرس' || selectedResult?.type === 'موظف') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5 text-xs font-sans">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">العنوان الوظيفي المعتمد:</span>
                        <strong className="text-slate-800 font-extrabold">{(selectedData as Teacher | Staff).jobTitle}</strong>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">
                          {selectedResult.type === 'مدرس' ? 'الاختصاص التعليمي:' : 'التحصيل الأكاديمي:'}
                        </span>
                        <strong className="text-indigo-850 font-extrabold">
                          {selectedResult.type === 'مدرس' ? (selectedData as Teacher).specialty : (selectedData as Staff).qualification}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 font-sans">
                        <span className="text-slate-400 block mb-0.5 font-bold">تاريخ المباشرة الفعلية:</span>
                        <strong className="text-slate-850 font-mono">{(selectedData as Teacher).currentSchoolDate}</strong>
                      </div>

                      <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 text-slate-800 md:col-span-2">
                        <span className="text-slate-400 block mb-0.5 font-bold">مدة الخدمة الفعلية المستمرة:</span>
                        <strong className="text-xs text-slate-900 font-extrabold">
                          {calculateActiveService((selectedData as Teacher).currentSchoolDate)}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">رقم الهاتف الفعال:</span>
                        <strong className="text-emerald-800 font-mono">{(selectedData as Teacher).phone}</strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">تاريخ التعيين المسبق:</span>
                        <strong className="text-slate-800 font-mono">{(selectedData as Teacher).appointmentDate}</strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">تاريخ التخرج بالجامعة:</span>
                        <strong className="text-slate-800 font-mono">{(selectedData as Teacher).gradDate}</strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mr-1 sm:col-span-2">
                        <span className="text-slate-400 block mb-0.5 font-bold">الكلية المعينة / معهد التخرج:</span>
                        <strong className="text-slate-800">{(selectedData as Teacher).college}</strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 sm:col-span-2">
                        <span className="text-slate-400 block mb-0.5 font-bold text-red-900 pr-1 border-r-2 border-red-400">اسم الأم الثلاثي المحجوب:</span>
                        <strong className="text-slate-800">{(selectedData as Teacher).motherName}</strong>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-slate-400 block mb-0.5 font-bold">موقع السكن الحالي:</span>
                        <strong className="text-slate-800">{(selectedData as Teacher).address}</strong>
                      </div>
                    </div>

                    {/* Teacher specific period distribution allocations view */}
                    {selectedResult.type === 'مدرس' && (
                      <div className="space-y-3.5 bg-slate-50/50 border border-slate-100 p-4.5 rounded-xl text-xs font-sans">
                        <h4 className="font-bold text-slate-800 border-b border-slate-200/50 pb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-emerald-700" />
                          نصاب واستحقاق الحصص التدريسية الإجمالي
                        </h4>
                        
                        {allocations.find(a => a.teacherName === selectedData.name) ? (
                          (() => {
                            const match_al = allocations.find(a => a.teacherName === selectedData.name)!;
                            return (
                              <div className="space-y-2 leading-relaxed">
                                <div>مجموع الحصص الأسبوعية: <span className="font-extrabold text-indigo-700 text-sm font-mono">{match_al.totalPeriods} حصة</span></div>
                                <div>المراحل والصفوف التدريسية: <span className="font-bold text-slate-850">{match_al.classesTaught.join('، ')}</span></div>
                                <div className="flex gap-4 border-t border-slate-200/50 pt-2 mt-2 font-mono text-[11px] text-slate-500">
                                  <span>شعبة (أ): {match_al.periodsPerSection['أ'] ?? 0}</span>
                                  <span>شعبة (ب): {match_al.periodsPerSection['ب'] ?? 0}</span>
                                  <span>شعبة (ج): {match_al.periodsPerSection['ج'] ?? 0}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-slate-400 italic">طبيعة الحصص والنصاب غير مرصودة لهذا التدريسي حالياً.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-50 text-center text-slate-400 py-12 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 font-sans select-none">
                <Compass className="h-10 w-10 text-slate-300 animate-spin-slow" />
                <span>يرجى اختيار أحد الأسماء المطابقة من القائمة اليمنى لعرض ملفه الشامل.</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
