/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Save, UserPlus, Users, Briefcase, Database, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { Student, Teacher, Staff, StudentType, SubjectKey } from '../types';
import { recalculateStudentGrades } from '../utils';

interface DataEntryFormProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  decisionLimit: number;
}

export function DataEntryForm({
  students,
  setStudents,
  teachers,
  setTeachers,
  staff,
  setStaff,
  decisionLimit
}: DataEntryFormProps) {
  // Master entry type dropdown trigger
  const [entryType, setEntryType] = useState<StudentType>(StudentType.STUDENT);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Shared Base Fields State
  const [name, setName] = useState('');
  const [dob, setDob] = useState('2010-01-01');
  const [birthPlace, setBirthPlace] = useState('ذي قار / الناصرية');
  const [nationalId, setNationalId] = useState('');
  const [nationalIdDate, setNationalIdDate] = useState('2520-01-01');
  const [address, setAddress] = useState('الناصرية - ');
  const [phone, setPhone] = useState('077');
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');

  // 2. Student-Specific Fields State
  const [studentClass, setStudentClass] = useState<'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي'>('الرابع العلمي');
  const [studentSection, setStudentSection] = useState('أ');
  const [failureYears, setFailureYears] = useState(0);
  const [isOrphan, setIsOrphan] = useState(false);
  const [hasDisease, setHasDisease] = useState(false);
  const [diseaseType, setDiseaseType] = useState('');
  const [canStudy, setCanStudy] = useState(true);
  const [cannotStudyReason, setCannotStudyReason] = useState('');

  // 3. Teacher/Staff-Specific Fields State
  const [empNum, setEmpNum] = useState('');
  const [specialtyOrQual, setSpecialtyOrQual] = useState('الرياضيات'); // Specialty for teacher, qualification for staff
  const [jobTitle, setJobTitle] = useState('مدرس'); // Title
  const [gradDate, setGradDate] = useState('2005-06-30');
  const [college, setCollege] = useState('جامعة بغداد / كلية التربية');
  const [motherName, setMotherName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2007-09-15');
  const [appointmentRef, setAppointmentRef] = useState('م.ت/٢٠١');
  const [currentSchoolDate, setCurrentSchoolDate] = useState('2012-09-01');
  const [lastWorkplace, setLastWorkplace] = useState('ثانوية الراية للبنين');
  const [workStatus, setWorkStatus] = useState('داوم فعلي');

  const handleResetForm = () => {
    setName('');
    setNationalId('');
    setMotherName('');
    setNotes('');
    setDiseaseType('');
    setCannotStudyReason('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('الرجاء إدخال الاسم كاملاً!');
      return;
    }

    if (entryType === StudentType.STUDENT) {
      // Create student
      const nextSeq = students.reduce((max, s) => s.seq > max ? s.seq : max, 0) + 1;
      const newStudent: Student = {
        id: `s-${Date.now()}`,
        seq: nextSeq,
        name: name.trim(),
        className: studentClass,
        classSection: studentSection.trim() || 'أ',
        dob,
        birthPlace,
        failureYears,
        nationalId,
        nationalIdDate,
        isOrphan,
        hasDisease,
        diseaseType: hasDisease ? diseaseType.trim() : undefined,
        address,
        canStudyThisYear: canStudy,
        cannotStudyReason: !canStudy ? cannotStudyReason : undefined,
        grades: {},
        overallResult: 'مستمر',
        failedSubjectsList: []
      };

      // Populate empty grades placeholders
      const dummySubjects = Object.values(SubjectKey);
      dummySubjects.forEach((subKey) => {
        newStudent.grades[subKey] = {};
      });

      // Recalculate
      const calculated = recalculateStudentGrades(
        newStudent,
        decisionLimit,
        studentClass === 'الرابع العلمي' ? dummySubjects : dummySubjects.filter(k => k !== SubjectKey.BAATH_CRIMES)
      );

      setStudents(prev => [...prev, calculated]);
      setSuccessMsg(`تم ترحيل وحفظ بيانات الطالب ( ${name} ) ضمن الصف ${studentClass} بنجاح.`);

    } else if (entryType === StudentType.TEACHER) {
      // Create teacher
      const nextSeq = teachers.reduce((max, t) => t.seq > max ? t.seq : max, 0) + 1;
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        seq: nextSeq,
        empNum: empNum || `EMP-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        specialty: specialtyOrQual,
        dob,
        jobTitle: jobTitle as any,
        birthPlace,
        gradDate,
        college,
        gender,
        motherName,
        appointmentDate,
        appointmentRef,
        currentSchoolDate,
        lastWorkplace,
        nationalId,
        nationalIdDate,
        status: workStatus,
        phone,
        address,
        notes
      };

      setTeachers(prev => [...prev, newTeacher]);
      setSuccessMsg(`تم ترحيل وحفظ بيانات المدرس ( ${name} ) ضمن الهيئة التدريسية بنجاح.`);

    } else {
      // Create Staff
      const nextSeq = staff.reduce((max, s) => s.seq > max ? s.seq : max, 0) + 1;
      const newStaff: Staff = {
        id: `st-${Date.now()}`,
        seq: nextSeq,
        empNum: empNum || `STF-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        qualification: specialtyOrQual,
        dob,
        jobTitle: jobTitle,
        birthPlace,
        gradDate,
        college,
        gender,
        motherName,
        appointmentDate,
        appointmentRef,
        currentSchoolDate,
        lastWorkplace,
        nationalId,
        nationalIdDate,
        status: workStatus,
        phone,
        address,
        notes
      };

      setStaff(prev => [...prev, newStaff]);
      setSuccessMsg(`تم ترحيل وحفظ بيانات الموظف ( ${name} ) بنجاح.`);
    }

    handleResetForm();
    setTimeout(() => {
      setSuccessMsg('');
    }, 4500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Segment Header */}
      <div className="border-b border-slate-100 pb-5 mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
            <Database className="h-6 w-6 text-emerald-700" />
            <h2 className="text-xl font-bold">بوابة رصد وإدخال وتوزيع البيانات الموحدة</h2>
          </div>
          <p className="text-xs text-slate-400">شيت ذكي موحد يسمح بإدخال القيود للطلاب أو الكوادر وترحيلها تلقائياً إلى الجداول المناسبة</p>
        </div>

        {/* Dropdown switch named "النوع" as requested */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">النوع المطلوب رصده:</span>
          <select
            value={entryType}
            onChange={(e: any) => { setEntryType(e.target.value); handleResetForm(); }}
            className="rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 px-4 py-2 text-xs font-extrabold outline-none"
          >
            <option value={StudentType.STUDENT}>طالب جديد</option>
            <option value={StudentType.TEACHER}>مدرس جديد</option>
            <option value={StudentType.STAFF}>موظف جديد</option>
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border-r-4 border-emerald-500 text-emerald-850 p-4.5 rounded-xl mb-6 text-xs font-bold flex gap-2.5 items-center animate-fade-in/70">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Main Entry Form Segment */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Bento Section 1: Common Personal Details */}
        <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50">
          <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider mb-4 border-r-2 border-indigo-600 pr-2">أولاً: البيانات الأساسية لبطاقة الهوية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">الاسم الثلاثي أو الكامل (مطلوب)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد جاسم محمد علي"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">تاريخ التولد (اليوم/الشهر/السنة)</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-[10px] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">محل وجنسية الولادة</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">رقم الهاتف الفعال</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="077XXXXXXXX"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none text-left font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">عنوان السكن الحالي بالتفصيل</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">رقم البطاقة الوطنية (أو هوية الأحوال)</label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none text-left"
              />
            </div>
          </div>
        </div>

        {/* Bento Section 2: Conditional blocks */}
        
        {/* STUDENT CONDITIONAL BLOCK */}
        {entryType === StudentType.STUDENT && (
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50 animate-fade-in/80">
            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider mb-4 border-r-2 border-emerald-600 pr-2">ثانياً: البيانات الدراسية والأكاديمية للطالب</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">الصف الدراسي المستهدف التوزيع عليه</label>
                <select
                  value={studentClass}
                  onChange={(e: any) => setStudentClass(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
                >
                  <option value="الرابع العلمي">الرابع العلمي</option>
                  <option value="الخامس العلمي">الخامس العلمي</option>
                  <option value="السادس العلمي">السادس العلمي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">الشعبة / الصف الداخلي (أ، ب، ج)</label>
                <input
                  type="text"
                  value={studentSection}
                  onChange={(e) => setStudentSection(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none text-center font-bold"
                  placeholder="أ"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">سنوات الرسوب الإجمالية المسبقة</label>
                <input
                  type="number"
                  value={failureYears}
                  onChange={(e) => setFailureYears(Number(e.target.value))}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none text-center font-mono"
                  min="0"
                />
              </div>

              {/* Orphan Status */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/50">
                <input
                  type="checkbox"
                  checked={isOrphan}
                  onChange={(e) => setIsOrphan(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-emerald-500"
                  id="chk-orphan"
                />
                <label htmlFor="chk-orphan" className="text-xs font-bold text-slate-700 cursor-pointer">هل الطالب يتيم الأب/الأم؟</label>
              </div>

              {/* Disease status */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/50">
                <input
                  type="checkbox"
                  checked={hasDisease}
                  onChange={(e) => setHasDisease(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  id="chk-disease"
                />
                <label htmlFor="chk-disease" className="text-xs font-bold text-slate-700 cursor-pointer">هل يعاني الطالب من مرض طبي؟</label>
              </div>

              {hasDisease && (
                <div className="animate-pulse-slow">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">نوع ومسمى المرض وتاريخ التفصيل</label>
                  <input
                    type="text"
                    value={diseaseType}
                    onChange={(e) => setDiseaseType(e.target.value)}
                    placeholder="فقر دم البحر الأبيض المتوسط"
                    className="block w-full rounded-xl border border-rose-200 bg-white p-2 text-xs outline-none text-rose-900 font-medium"
                  />
                </div>
              )}

              {/* Eligible to study checkbox */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/50 md:col-span-1">
                <input
                  type="checkbox"
                  checked={canStudy}
                  onChange={(e) => setCanStudy(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                  id="chk-can-study"
                />
                <label htmlFor="chk-can-study" className="text-xs font-bold text-slate-700 cursor-pointer">يحق له الدوام خلال هذا العام؟</label>
              </div>

              {!canStudy && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">سبب الاستبعاد أو عدم الأحقية بالدوام</label>
                  <select
                    value={cannotStudyReason}
                    onChange={(e) => setCannotStudyReason(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none"
                  >
                    <option value="">اختر السبب من القائمة المعتمدة...</option>
                    <option value="راسب سنتين متتاليتين في نفس الصف">راسب سنتين متتاليتين في نفس الصف</option>
                    <option value="العمر لا يسمح بالبقاء في الدراسة الصباحية">العمر لا يسمح بالبقاء في الدراسة الصباحية</option>
                    <option value="أخرى - مستبعد بقرار وزاري">أخرى - مستبعد بقرار وزاري</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEACHER OR STAFF CONDITIONAL BLOCK */}
        {(entryType === StudentType.TEACHER || entryType === StudentType.STAFF) && (
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50 animate-fade-in/80">
            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider mb-4 border-r-2 border-emerald-600 pr-2">
              ثانياً: البيانات والمؤهلات الأدارية للموظف / المدرس
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-500 font-sans text-xs font-semibold">
              <div>
                <label className="block mb-1">الرقم الوظيفي الفريد</label>
                <input
                  type="text"
                  value={empNum}
                  onChange={(e) => setEmpNum(e.target.value)}
                  placeholder="T10014"
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block mb-1">
                  {entryType === StudentType.TEACHER ? 'الاختصاص العلمي والتدريسي' : 'التحصيل الدراسي والشهادة'}
                </label>
                <input
                  type="text"
                  value={specialtyOrQual}
                  onChange={(e) => setSpecialtyOrQual(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">العنوان الوظيفي المالي</label>
                {entryType === StudentType.TEACHER ? (
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                  >
                    <option value="مدرس">مدرس واختصاصي</option>
                    <option value="مدير">مدير المدرسة الرئيسي</option>
                    <option value="معاون">معاون شؤون فني</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="كاتب / أمين صندوق / مبرمج"
                    className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-normal"
                  />
                )}
              </div>

              <div>
                <label className="block mb-1">اسم الأم الثلاثي</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">الكلية أو معهد التخرج المعين</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">تاريخ المباشرة بالمدرسة الحالية</label>
                <input
                  type="date"
                  value={currentSchoolDate}
                  onChange={(e) => setCurrentSchoolDate(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-1.5 text-[9px] font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">تاريخ التعيين لأول مرة بالوزارة</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-1.5 text-[9px] font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">رقم رمز صادر تعيين الملاك</label>
                <input
                  type="text"
                  value={appointmentRef}
                  onChange={(e) => setAppointmentRef(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-1.5 text-xs font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">حالة الدوام الفعلي والمنسوب والاجازات</label>
                <select
                  value={workStatus}
                  onChange={(e) => setWorkStatus(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                >
                  <option value="داوم فعلي">داوم فعلي مستمر</option>
                  <option value="منسب إلى المدرسة">منسب إلى المدرسة</option>
                  <option value="منسب من المدرسة">منسب من المدرسة</option>
                  <option value="مجاز">في إجازة دورية رسمية</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bento Section 3: Notes block & submit button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs active:scale-98 shadow-md shadow-emerald-700/15 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            حفظ وترحيل البيانات فورياً
          </button>
          
          <button
            type="button"
            onClick={handleResetForm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-all cursor-pointer text-center"
          >
            مسح الاستمارة الحالية
          </button>
        </div>

      </form>

    </div>
  );
}
