/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Teacher, AppSettings } from '../types';
import { calculateActiveService } from '../utils';
import { UserCheck, Plus, Trash2, Search, Award, Compass, Timer, Phone, Calendar, X, Save, ArrowRight, Edit } from 'lucide-react';

interface TeachersInfoProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  settings: AppSettings;
}

export function TeachersInfo({ teachers, setTeachers, settings }: TeachersInfoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const initialFormState = {
    empNum: '',
    name: '',
    specialty: '',
    dob: '',
    jobTitle: 'مدرس',
    birthPlace: '',
    gradDate: '',
    college: '',
    gender: 'ذكر' as const,
    motherName: '',
    appointmentDate: '',
    appointmentRef: '',
    currentSchoolDate: '',
    lastWorkplace: '',
    nationalId: '',
    nationalIdDate: '',
    status: 'داوم فعلي',
    phone: '',
    address: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Force actual service update daily/periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60 * 60); // update every hour
    return () => clearInterval(timer);
  }, []);

  const handleStartEdit = (teacher: Teacher) => {
    setFormData({
      empNum: teacher.empNum || '',
      name: teacher.name || '',
      specialty: teacher.specialty || '',
      dob: teacher.dob || '',
      jobTitle: teacher.jobTitle || 'مدرس',
      birthPlace: teacher.birthPlace || '',
      gradDate: teacher.gradDate || '',
      college: teacher.college || '',
      gender: (teacher.gender === 'أنثى' ? 'أنثى' : 'ذكر') as 'ذكر' | 'أنثى',
      motherName: teacher.motherName || '',
      appointmentDate: teacher.appointmentDate || '',
      appointmentRef: teacher.appointmentRef || '',
      currentSchoolDate: teacher.currentSchoolDate || '',
      lastWorkplace: teacher.lastWorkplace || '',
      nationalId: teacher.nationalId || '',
      nationalIdDate: teacher.nationalIdDate || '',
      status: teacher.status || 'داوم فعلي',
      phone: teacher.phone || '',
      address: teacher.address || '',
      notes: teacher.notes || ''
    });
    setEditingTeacherId(teacher.id);
    setShowAddForm(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم المدرس الكامل.');
      return;
    }

    if (editingTeacherId) {
      setTeachers(prev => prev.map(t => t.id === editingTeacherId ? { ...t, ...formData } : t));
    } else {
      const nextSeq = teachers.reduce((max, t) => t.seq > max ? t.seq : max, 0) + 1;
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        seq: nextSeq,
        ...formData
      };
      setTeachers(prev => [...prev, newTeacher]);
    }

    setShowAddForm(false);
    setFormData(initialFormState);
    setEditingTeacherId(null);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
      setTeachers(prev => prev.filter(t => t.id !== id).map((t, idx) => ({ ...t, seq: idx + 1 })));
    }
  };

  const handleCellEdit = (id: string, field: keyof Teacher, value: any) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.includes(searchTerm) || 
    t.specialty.includes(searchTerm) || 
    t.phone.includes(searchTerm)
  );

  if (showAddForm) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans select-none" dir="rtl">
        {/* Form Title & Back Button */}
        <div className="flex justify-between items-center pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => { setShowAddForm(false); setEditingTeacherId(null); }}
              className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
              title="رجوع للشيت"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                {editingTeacherId ? 'تعديل اضبارة معلم/مدرس' : 'إضافة مدرس جديد لقاعدة البيانات'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">يرجى ملء الحقول التالية بعناية، سيتم حفظ المدرس وحساب خدمته المستمرة تلقائياً.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveForm} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الاسم الثلاثي واللقب *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="مثال: هيثم برزان الزيدي"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الاختصاص التدريسي</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={e => setFormData(p => ({ ...p, specialty: e.target.value }))}
                placeholder="مثال: الرياضيات"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* jobTitle */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">العنوان الوظيفي</label>
              <select
                value={formData.jobTitle}
                onChange={e => setFormData(p => ({ ...p, jobTitle: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              >
                <option value="مدرس">مدرس</option>
                <option value="معاون">معاون</option>
                <option value="مدير">مدير</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التولد</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Birthplace */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">محل الولادة (المحافظة)</label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={e => setFormData(p => ({ ...p, birthPlace: e.target.value }))}
                placeholder="مثال: ذي قار"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الكلية المعينة / التحصيل الدراسي</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData(p => ({ ...p, college: e.target.value }))}
                placeholder="مثال: كلية التربية للعلوم الصرفة"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* gradDate */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التخرج</label>
              <input
                type="date"
                value={formData.gradDate}
                onChange={e => setFormData(p => ({ ...p, gradDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الجنس</label>
              <select
                value={formData.gender}
                onChange={e => setFormData(p => ({ ...p, gender: e.target.value as 'ذكر' | 'أنثى' }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم الأم الثلاثي</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={e => setFormData(p => ({ ...p, motherName: e.target.value }))}
                placeholder="اسم الأم الثلاثي بالكامل"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* empNum */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الرقم الوظيفي</label>
              <input
                type="text"
                value={formData.empNum}
                onChange={e => setFormData(p => ({ ...p, empNum: e.target.value }))}
                placeholder="مثال: EMP123456"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم الهاتف الشخصي</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="077XXXXXXXX"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم البطاقة الوطنية الموحدة</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={e => setFormData(p => ({ ...p, nationalId: e.target.value }))}
                placeholder="رقم البطاقة الوطنية الموحدة"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* National ID Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ إصدار البطاقة الوطنية</label>
              <input
                type="date"
                value={formData.nationalIdDate}
                onChange={e => setFormData(p => ({ ...p, nationalIdDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التعيين الأول</label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={e => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Appointment Ref */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم كتاب قرار التعيين</label>
              <input
                type="text"
                value={formData.appointmentRef}
                onChange={e => setFormData(p => ({ ...p, appointmentRef: e.target.value }))}
                placeholder="مثال: ص/٢٠١"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Current School Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ المباشرة الحالية في هذه المدرسة *</label>
              <input
                type="date"
                required
                value={formData.currentSchoolDate}
                onChange={e => setFormData(p => ({ ...p, currentSchoolDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Last Workplace */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">آخر مكان عمل (المدرسة السابقة)</label>
              <input
                type="text"
                value={formData.lastWorkplace}
                onChange={e => setFormData(p => ({ ...p, lastWorkplace: e.target.value }))}
                placeholder="مثال: ثانوية الفرات للبنين"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">حالة الدوام والتنسيب والإجازة</label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
              >
                <option value="داوم فعلي">داوم فعلي</option>
                <option value="منسب إلى المدرسة">منسب إلى المدرسة</option>
                <option value="منسب من المدرسة">منسب من المدرسة</option>
                <option value="مجاز مريض">مجاز مريض</option>
                <option value="مجاز اعتيادي">مجاز اعتيادي</option>
              </select>
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">عنوان السكن بالكامل</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
              placeholder="المحافظة - القضاء - الحي - رقم الدار"
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">ملاحظات إضافية</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="أي معلومات إضافية..."
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-start pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-1.5 py-2 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              <Save className="h-4 w-4" />
              حفظ المعلومات
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingTeacherId(null); }}
              className="flex items-center gap-1.5 py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-all"
            >
              <X className="h-3.5 w-3.5" />
              إلغاء الأمر
            </button>
          </div>
        </form>
      </div>
    );
  }

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
            <div className="flex items-center gap-2 text-emerald-800 mb-0.5">
              <UserCheck className="h-5.5 w-5.5" />
              <h2 className="text-lg font-bold font-sans">شيت الهيئة التدريسية (المدرسين والمعاونين والمدير)</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">ملاك الكادر التربوي، الاختصاصات العلمية، وحساب الخدمة المستمرة تلقائياً • إعداد وبرمجة: هيثم برزان الزيدي</p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingTeacherId(null);
            setShowAddForm(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          إضافة مدرس جديد
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4.5 mb-6">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">البحث السريع في ملفات المدرسين</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث حسب اسم المدرس، الاختصاص، أو رقم الهاتف..."
            className="block w-full max-w-lg rounded-xl border border-slate-200 bg-white pr-10 pl-3 py-2 text-slate-850 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner max-w-full overflow-x-auto">
        <table className="w-full text-slate-700 border-collapse text-xs select-text">
          <thead className="bg-[#fcfdfe] border-b border-slate-100 text-[11px] font-bold text-slate-600">
            <tr>
              <th className="py-3 px-3 text-right bg-slate-50 border-l border-slate-100 w-12">تسلسل</th>
              <th className="py-3 px-4 text-right bg-slate-50 border-l border-slate-100 w-44">اسم المدرس</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">الرقم الوظيفي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100 font-sans">العنوان الوظيفي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100 bg-emerald-50/15">الاختصاص</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">التولد</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">تاريخ المباشرة الحالية</th>
              <th className="py-3 px-4 text-center border-l border-slate-100 bg-amber-50/20 font-sans">الخدمة الفعلية (محدث يومياً)</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">محل الولادة</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">تاريخ التعيين</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">تاريخ التخرج</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">الكلية المعينة</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">اسم الأم الثلاثي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100 font-sans">حالة الدوام والتنسيب والإجازة</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">رقم الهاتف</th>
              <th className="py-3 px-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredTeachers.map((teacher) => {
              const activeService = calculateActiveService(teacher.currentSchoolDate);
              return (
                <tr key={teacher.id} className="hover:bg-slate-50/40">
                  {/* Seq */}
                  <td className="py-2 px-3 font-bold text-center bg-slate-50/40 border-l border-slate-100">
                    {teacher.seq}
                  </td>

                  {/* Name */}
                  <td className="py-2 px-4 font-bold text-slate-800 border-l border-slate-100">
                    <input
                      type="text"
                      value={teacher.name}
                      onChange={(e) => handleCellEdit(teacher.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none text-right font-bold outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded p-1"
                    />
                  </td>

                  {/* Emp ID */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={teacher.empNum}
                      onChange={(e) => handleCellEdit(teacher.id, 'empNum', e.target.value)}
                      className="w-24 text-center bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded font-mono p-1"
                    />
                  </td>

                  {/* Job Title: Director, Assistant, Teacher etc. */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <select
                      value={teacher.jobTitle}
                      onChange={(e) => handleCellEdit(teacher.id, 'jobTitle', e.target.value)}
                      className="rounded border border-slate-150 py-1 px-1.5 bg-white text-[11px]"
                    >
                      <option value="مدرس">مدرس</option>
                      <option value="مدير">مدير</option>
                      <option value="معاون">معاون</option>
                    </select>
                  </td>

                  {/* Specialty */}
                  <td className="py-2 px-3 text-center border-l border-slate-100 bg-emerald-55/5">
                    <input
                      type="text"
                      value={teacher.specialty}
                      onChange={(e) => handleCellEdit(teacher.id, 'specialty', e.target.value)}
                      className="w-20 text-center bg-transparent border-none outline-none focus:bg-white font-semibold rounded"
                    />
                  </td>

                  {/* DOB */}
                  <td className="py-2 px-3 text-center border-l border-slate-100 font-mono text-[11px]">
                    <input
                      type="date"
                      value={teacher.dob}
                      onChange={(e) => handleCellEdit(teacher.id, 'dob', e.target.value)}
                      className="bg-transparent border-none text-center text-[10px] focus:bg-white rounded"
                    />
                  </td>

                  {/* Starting School Current Date */}
                  <td className="py-2 px-3 text-center border-l border-slate-100 font-mono text-[11px]">
                    <input
                      type="date"
                      value={teacher.currentSchoolDate}
                      onChange={(e) => handleCellEdit(teacher.id, 'currentSchoolDate', e.target.value)}
                      className="bg-transparent border-none text-center text-[10px] focus:bg-white rounded"
                    />
                  </td>

                  {/* Active Service Counter - auto calculating daily! */}
                  <td className="py-2 px-4 text-center font-bold text-slate-800 bg-amber-50/10 border-l border-slate-100 text-[11px]">
                    <span className="flex items-center gap-1.5 justify-center">
                      <Timer className="h-3.5 w-3.5 animate-spin-slow text-amber-600" />
                      {activeService}
                    </span>
                  </td>

                  {/* Birthplace */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={teacher.birthPlace}
                      onChange={(e) => handleCellEdit(teacher.id, 'birthPlace', e.target.value)}
                      className="w-24 bg-transparent border-none text-center outline-none"
                    />
                  </td>

                  {/* appointmentDate */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="date"
                      value={teacher.appointmentDate}
                      onChange={(e) => handleCellEdit(teacher.id, 'appointmentDate', e.target.value)}
                      className="bg-transparent border-none text-[10px]"
                    />
                  </td>

                  {/* gradDate */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="date"
                      value={teacher.gradDate}
                      onChange={(e) => handleCellEdit(teacher.id, 'gradDate', e.target.value)}
                      className="bg-transparent border-none text-[10px]"
                    />
                  </td>

                  {/* College */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={teacher.college}
                      onChange={(e) => handleCellEdit(teacher.id, 'college', e.target.value)}
                      className="w-28 bg-transparent border-none text-center outline-none"
                    />
                  </td>

                  {/* Mother Name */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={teacher.motherName}
                      onChange={(e) => handleCellEdit(teacher.id, 'motherName', e.target.value)}
                      className="w-24 bg-transparent border-none text-center outline-none"
                    />
                  </td>

                  {/* Status: Active, Leave, On-secondment */}
                  <td className="py-2 px-3 border-l border-slate-100">
                    <select
                      value={teacher.status}
                      onChange={(e) => handleCellEdit(teacher.id, 'status', e.target.value)}
                      className="rounded border border-slate-200 py-1 bg-white text-[10px] w-full"
                    >
                      <option value="داوم فعلي">داوم فعلي</option>
                      <option value="منسب إلى المدرسة">منسب إلى المدرسة</option>
                      <option value="منسب من المدرسة">منسب من المدرسة</option>
                      <option value="مجاز مريض">مجاز مريض</option>
                      <option value="مجاز اعتيادي">مجاز اعتيادي</option>
                    </select>
                  </td>

                  {/* Phone */}
                  <td className="py-2 px-3 text-center border-l border-[#f1f5f9] font-mono text-emerald-800 font-bold">
                    <input
                      type="text"
                      value={teacher.phone}
                      onChange={(e) => handleCellEdit(teacher.id, 'phone', e.target.value)}
                      placeholder="077XXXXXXXX"
                      className="w-24 bg-transparent text-center border-none font-bold"
                    />
                  </td>

                  {/* Procedures */}
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(teacher)}
                        title="تعديل التفاصيل بالكامل"
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
