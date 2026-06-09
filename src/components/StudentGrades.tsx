/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Plus, Trash2, FileSpreadsheet, Search, CheckCircle, HelpCircle, AlertTriangle, ArrowRightLeft, Sparkles, Filter 
} from 'lucide-react';
import { Student, SubjectKey, AppSettings } from '../types';
import { recalculateStudentGrades } from '../utils';

interface StudentGradesProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  settings: AppSettings;
}

export function StudentGrades({ students, setStudents, settings }: StudentGradesProps) {
  const [selectedClass, setSelectedClass] = useState<'الكل' | 'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي'>('الكل');
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | 'الكل'>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [pasteData, setPasteData] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteTargetClass, setPasteTargetClass] = useState<'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي'>('الرابع العلمي');
  const [pasteTargetSection, setPasteTargetSection] = useState('أ');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Filtered student list
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

  const handleCellChange = (
    studentId: string,
    subjectKey: string,
    field: string,
    value: string
  ) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      const numericVal = value === '' ? undefined : Number(value);
      if (numericVal !== undefined && (numericVal < 0 || numericVal > 100 || isNaN(numericVal))) {
        return student; // safety bounds
      }

      const updatedGrades = {
        ...student.grades,
        [subjectKey]: {
          ...student.grades[subjectKey],
          [field]: numericVal
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

  const handleAddStudent = () => {
    const currentMaxSeq = students.reduce((max, s) => s.seq > max ? s.seq : max, 0);
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      seq: currentMaxSeq + 1,
      name: 'اسم الطالب الجديد',
      className: 'الرابع العلمي',
      classSection: 'أ',
      dob: '2010-01-01',
      birthPlace: 'الناصرية',
      failureYears: 0,
      nationalId: '',
      nationalIdDate: '',
      isOrphan: false,
      hasDisease: false,
      address: '',
      canStudyThisYear: true,
      grades: {},
      overallResult: 'مستمر',
      failedSubjectsList: []
    };
    
    // Initialize default grades structure
    const keys = settings.allowedSubjects['الرابع العلمي'];
    keys.forEach(k => {
      newStudent.grades[k] = {};
    });

    const calculated = recalculateStudentGrades(newStudent, settings.decisionLimit, keys);
    setStudents(prev => [...prev, calculated]);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً من سجل الدرجات؟')) {
      setStudents(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, seq: idx + 1 })));
    }
  };

  // TSV Parsing for Bulk Copy-Paste
  const handleBulkPaste = () => {
    if (!pasteData.trim()) {
      alert('الرجاء إدخال بيانات صالحة منسوبة من Excel أولاً.');
      return;
    }

    const lines = pasteData.trim().split('\n');
    const newStudentsList: Student[] = [];
    const activeSubjects = settings.allowedSubjects[pasteTargetClass];
    let addedCount = 0;

    lines.forEach((line, index) => {
      const cells = line.split('\t');
      if (cells.length < 1 || !cells[0].trim()) return;

      // Schema of copied rows:
      // Column 0: Student Name
      // Columns 1+: values of Month 1, Month 2, Midyear, Month 1 T2, Month 2 T2, Final Exam for successive subjects
      const name = cells[0].trim();
      const studentId = `s-paste-${Date.now()}-${index}`;

      const templateGrades: Record<string, any> = {};
      
      // We will map columns logically to the active subjects
      let cellOffset = 1;
      activeSubjects.forEach(subjectKey => {
        // Each subject gets 6 inputs from Excel pasted sequentially: m1t1, m2t1, midyear, m1t2, m2t2, final
        const m1t1_raw = cells[cellOffset];
        const m2t1_raw = cells[cellOffset + 1];
        const midyear_raw = cells[cellOffset + 2];
        const m1t2_raw = cells[cellOffset + 3];
        const m2t2_raw = cells[cellOffset + 4];
        const final_raw = cells[cellOffset + 5];

        templateGrades[subjectKey] = {
          m1t1: m1t1_raw ? Number(m1t1_raw) : undefined,
          m2t1: m2t1_raw ? Number(m2t1_raw) : undefined,
          midyear: midyear_raw ? Number(midyear_raw) : undefined,
          m1t2: m1t2_raw ? Number(m1t2_raw) : undefined,
          m2t2: m2t2_raw ? Number(m2t2_raw) : undefined,
          finalExam: final_raw ? Number(final_raw) : undefined,
        };

        cellOffset += 6;
      });

      const studentObj: Student = {
        id: studentId,
        seq: students.length + addedCount + 1,
        name,
        className: pasteTargetClass,
        classSection: pasteTargetSection,
        dob: '2010-01-01',
        birthPlace: 'الناصرية',
        failureYears: 0,
        nationalId: '',
        nationalIdDate: '',
        isOrphan: false,
        hasDisease: false,
        address: '',
        canStudyThisYear: true,
        grades: templateGrades,
        overallResult: 'مستمر',
        failedSubjectsList: []
      };

      const calculated = recalculateStudentGrades(studentObj, settings.decisionLimit, activeSubjects);
      newStudentsList.push(calculated);
      addedCount++;
    });

    if (newStudentsList.length > 0) {
      setStudents(prev => [...prev, ...newStudentsList]);
      alert(`تم إضافة ${newStudentsList.length} طالب إلى شيت الدرجات بنجاح.`);
      setPasteData('');
      setShowPasteModal(false);
    }
  };

  // Get active subjects based on chosen selection (either filters single subject or fallback to active class subjects list)
  const renderedSubjects = selectedSubject !== 'الكل' 
    ? [selectedSubject] 
    : (selectedClass !== 'الكل' ? settings.allowedSubjects[selectedClass] : Object.values(SubjectKey));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Tab Header Action Bar */}
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
            <div className="flex items-center gap-2 text-emerald-800 mb-0.5">
              <FileSpreadsheet className="h-5.5 w-5.5" />
              <h2 className="text-lg font-bold">شيت درجات الطلاب (١٨٠٠ طالب)</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">جدول درجات الفصول ونصف السنة والسعي السنوي ونهاية العام الدراسي • إعداد وبرمجة: هيثم برزان الزيدي</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPasteModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold transition-all border border-orange-200/50 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            استيراد مباشر من Excel
          </button>
          
          <button
            onClick={handleAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-700/10 active:scale-98 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            إضافة طالب جديد
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-slate-50 rounded-2xl p-4.5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">تصفية حسب الصف</label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e: any) => {
                setSelectedClass(e.target.value);
                setSelectedSubject('الكل'); // Reset subject filter on class changes
              }}
              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="الكل">كل الصفوف الدراسية</option>
              <option value="الرابع العلمي">الرابع العلمي</option>
              <option value="الخامس العلمي">الخامس العلمي</option>
              <option value="السادس العلمي">السادس العلمي</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">التركيز على مادة معينة</label>
          <select
            value={selectedSubject}
            onChange={(e: any) => setSelectedSubject(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="الكل">مظهر عام (جميع المواد)</option>
            {Object.values(SubjectKey).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">البحث السريع</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الطالب أو الشعبة..."
              className="block w-full rounded-xl border border-slate-200 bg-white pr-10 pl-3 py-2 text-slate-705 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Grid container with responsive scroll */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner max-w-full overflow-x-auto">
        <table className="w-full text-slate-700 border-collapse text-xs select-text">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold">
            <tr>
              <th className="py-3 px-3 text-right bg-slate-100 sticky right-0 z-10 w-12 border-l border-slate-200">تسلسل</th>
              <th className="py-3 px-4 text-right bg-slate-100 sticky right-12 z-10 w-48 border-l border-slate-200">اسم الطالب</th>
              <th className="py-3 px-3 text-center border-l border-slate-200 bg-slate-50">الصف والشعبة</th>
              
              {/* Dynamic Headers per subject */}
              {renderedSubjects.map((subKey) => (
                <th key={subKey} colSpan={10} className="text-center py-2 border-l border-slate-200 bg-emerald-55/40 text-emerald-900 border-b border-emerald-100">
                  {subKey}
                </th>
              ))}
              
              <th className="py-3 px-4 text-center border-r border-slate-100 bg-slate-100">النتيجة</th>
              <th className="py-3 px-3 text-center bg-slate-100">دروس الإكمال</th>
              <th className="py-3 px-3 text-center bg-slate-100 w-12">إجراءات</th>
            </tr>
            <tr className="bg-slate-50/40 text-[9px] text-slate-500">
              <th className="py-1 bg-slate-100 sticky right-0 z-10 border-l border-b border-slate-200"></th>
              <th className="py-1 bg-slate-100 sticky right-12 z-10 border-l border-b border-slate-200"></th>
              <th className="py-1 border-l border-b border-slate-200"></th>
              
              {renderedSubjects.map((subKey) => (
                <React.Fragment key={`sub-cols-${subKey}`}>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/5 font-medium">ش1 ف1</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/5 font-medium">ش2 ف1</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/20 font-bold">معدل ف1</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-amber-50/20 font-medium">نصف السنة</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/5 font-medium">ش1 ف2</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/5 font-medium">ش2 ف2</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/20 font-bold">معدل ف2</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-50/25 font-bold">السعي</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-indigo-50/30 font-bold text-indigo-905">النهائي</th>
                  <th className="py-1 px-1 border-l border-b border-slate-200 bg-emerald-100/50 font-extrabold text-emerald-950">الدرجة</th>
                </React.Fragment>
              ))}
              <th className="border-b border-slate-100"></th>
              <th className="border-b border-slate-100"></th>
              <th className="border-b border-slate-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={renderedSubjects.length * 10 + 6} className="py-10 text-center text-slate-400 font-medium bg-slate-50">
                  <span className="flex flex-col items-center gap-1">
                    <Users className="h-8 w-8 text-slate-300" />
                    لا يوجد طلاب مطابقين لخيارات البحث أو التصفية الحالية.
                  </span>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const subKeys = settings.allowedSubjects[student.className];
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all font-mono">
                    {/* Index */}
                    <td className="py-2.5 px-3 text-right font-bold text-slate-500 bg-slate-50/80 sticky right-0 z-10 border-l border-slate-200 border-r border-slate-100">
                      {student.seq}
                    </td>
                    
                    {/* Editable Name */}
                    <td className="py-2.5 px-4 font-sans text-right select-all font-semibold text-slate-800 bg-slate-50 sticky right-12 z-10 border-l border-slate-200">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => {
                          setStudents(prev => prev.map(s => s.id === student.id ? { ...s, name: e.target.value } : s));
                        }}
                        className="w-full bg-transparent border-none text-right font-semibold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 p-1 rounded transition-all"
                      />
                    </td>

                    {/* Class & Section */}
                    <td className="py-2.5 px-3 text-center border-l border-slate-200 font-sans">
                      <div className="flex items-center gap-1 justify-center">
                        <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold select-none">{student.className}</span>
                        <input
                          type="text"
                          value={student.classSection}
                          onChange={(e) => {
                            setStudents(prev => prev.map(s => s.id === student.id ? { ...s, classSection: e.target.value } : s));
                          }}
                          className="w-8 text-center bg-transparent border-b border-transparent focus:border-indigo-300 focus:bg-white outline-none font-bold text-slate-700 rounded"
                        />
                      </div>
                    </td>

                    {/* Subject Grade Cells */}
                    {renderedSubjects.map((subKey) => {
                      const isAllowed = subKeys.includes(subKey);
                      const subGrades = student.grades[subKey] || {};
                      
                      if (!isAllowed) {
                        return (
                          <td key={`${student.id}-${subKey}`} colSpan={10} className="bg-slate-100/50 text-slate-400 text-center py-2 border-l border-slate-250 italic select-none">
                            محجوبة
                          </td>
                        );
                      }

                      return (
                        <React.Fragment key={`${student.id}-${subKey}`}>
                          {/* m1t1 */}
                          <td className="p-0 border-l border-slate-200 w-11">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.m1t1 ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'm1t1', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-slate-100 outline-none transition-all"
                            />
                          </td>
                          {/* m2t1 */}
                          <td className="p-0 border-l border-slate-200 w-11">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.m2t1 ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'm2t1', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-slate-100 outline-none transition-all"
                            />
                          </td>
                          {/* avg1 */}
                          <td className="p-0 border-l border-slate-200 w-12 bg-emerald-50/10 font-semibold text-center select-all">
                            {subGrades.avg1 ?? '-'}
                          </td>
                          {/* midyear */}
                          <td className="p-0 border-l border-slate-200 w-11 bg-amber-50/5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.midyear ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'midyear', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-amber-100 outline-none transition-all"
                            />
                          </td>
                          {/* m1t2 */}
                          <td className="p-0 border-l border-slate-200 w-11">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.m1t2 ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'm1t2', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-slate-100 outline-none transition-all"
                            />
                          </td>
                          {/* m2t2 */}
                          <td className="p-0 border-l border-slate-200 w-11">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.m2t2 ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'm2t2', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-slate-100 outline-none transition-all"
                            />
                          </td>
                          {/* avg2 */}
                          <td className="p-0 border-l border-slate-200 w-12 bg-emerald-50/10 font-semibold text-center select-all">
                            {subGrades.avg2 ?? '-'}
                          </td>
                          {/* endeavor / سعي */}
                          <td className="p-0 border-l border-slate-200 w-11 bg-emerald-50/5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.endeavor ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'endeavor', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-emerald-100 outline-none font-bold text-emerald-800 transition-all"
                              placeholder="-"
                            />
                          </td>
                          {/* finalExam / امتحان النهائي */}
                          <td className="p-0 border-l border-slate-200 w-11 bg-indigo-50/5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subGrades.finalExam ?? ''}
                              onChange={(e) => handleCellChange(student.id, subKey, 'finalExam', e.target.value)}
                              className="w-full h-8 text-center bg-transparent hover:bg-indigo-150/40 outline-none font-bold text-slate-900 transition-all"
                              placeholder="-"
                            />
                          </td>
                          {/* finalAfterDecision / الدرجة النهائية */}
                          <td className={`p-0 border-l border-slate-150 w-12 text-center font-extrabold text-[10px] ${
                            (subGrades.finalAfterDecision ?? subGrades.finalGrade) !== undefined && (subGrades.finalAfterDecision ?? subGrades.finalGrade)! < 50
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50/30 text-emerald-800'
                          }`}>
                            {subGrades.finalAfterDecision ?? subGrades.finalGrade ?? '-'}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Overall Results summary */}
                    <td className="py-2.5 px-4 text-center font-bold border-r border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        student.overallResult === 'ناجح' ? 'bg-emerald-100 text-emerald-800' :
                        student.overallResult === 'مكمل' ? 'bg-amber-100 text-amber-800' :
                        student.overallResult === 'راسب' ? 'bg-red-100 text-red-700 border-red-300 font-extrabold' : 'bg-slate-100 text-slate-500'
                      }`} style={student.overallResult === 'راسب' ? { color: '#dc2626', backgroundColor: '#fee2e2', borderColor: '#fca5a5' } : {}}>
                        {student.overallResult}
                      </span>
                    </td>

                    {/* Failed / Incomplete Courses list */}
                    <td className="py-2.5 px-3 text-center border-l border-slate-100 max-w-[120px] truncate" title={student.failedSubjectsList.join('، ')}>
                      <span className="text-[10px] text-slate-400 font-sans">
                        {student.failedSubjectsList.length > 0 ? student.failedSubjectsList.join('، ') : 'بدون دروس'}
                      </span>
                    </td>

                    {/* Quick Delete action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {/* Excel Paste Import Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" dir="rtl">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-800" />
                <h3 className="text-md font-bold text-slate-800">استيراد جماعي من جدول بيانات Excel</h3>
              </div>
              <button 
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition-all p-1"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-850 flex gap-2 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold mb-1">تعليمات النسخ واللصق:</p>
                  <p className="leading-relaxed">
                    1. في شيت Excel، رتب العمود الأول باسم الطالب، ويليه 6 أعمدة لكل مادة بالترتيب التالي: (الدرجة الأولى، الدرجة الثانية، نصف السنة، الدرجة الثالثة، الدرجة الرابعة، الامتحان النهائي).
                    <br />
                    2. حدد الصفوف كاملة، انسخها (Ctrl+C)، ثم الصقها في الحقل أدناه (Ctrl+V).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">الصف المستهدف لترحيل البيانات</label>
                  <select
                    value={pasteTargetClass}
                    onChange={(e: any) => setPasteTargetClass(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
                  >
                    <option value="الرابع العلمي">الرابع العلمي</option>
                    <option value="الخامس العلمي">الخامس العلمي</option>
                    <option value="السادس العلمي">السادس العلمي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">الشعبة</label>
                  <input
                    type="text"
                    value={pasteTargetSection}
                    onChange={(e) => setPasteTargetSection(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none text-center font-bold"
                    placeholder="أ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">الصق المحتوى من Excel هنا (أعمدة مفصولة بـ Tab)</label>
                <textarea
                  rows={8}
                  value={pasteData}
                  onChange={(e) => setPasteData(e.target.value)}
                  placeholder="محمد أحمد قاسم&#9;40&#9;45&#9;50&#9;48&#9;49&#9;50&#10;حسين علي رضا&#9;80&#9;85&#9;90&#9;85&#9;88&#9;90"
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBulkPaste}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-all cursor-pointer"
                >
                  تحويل وإدراج بالجدول الذاتي
                </button>
                <button
                  onClick={() => setShowPasteModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition-all cursor-pointer"
                >
                  إلغاء الخروج
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
