/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Staff, AppSettings } from '../types';
import { calculateActiveService } from '../utils';
import { Briefcase, Plus, Trash2, Search, Timer, Compass, Phone, X, Save, ArrowRight, Edit } from 'lucide-react';

interface StaffInfoProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  settings: AppSettings;
}

export function StaffInfo({ staff, setStaff, settings }: StaffInfoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const initialFormState = {
    empNum: '',
    name: '',
    qualification: '',
    dob: '',
    jobTitle: '',
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

  // Force active service update periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60 * 60); // update every hour
    return () => clearInterval(timer);
  }, []);

  const handleStartEdit = (item: Staff) => {
    setFormData({
      empNum: item.empNum || '',
      name: item.name || '',
      qualification: item.qualification || '',
      dob: item.dob || '',
      jobTitle: item.jobTitle || 'كاتب',
      birthPlace: item.birthPlace || '',
      gradDate: item.gradDate || '',
      college: item.college || '',
      gender: (item.gender === 'أنثى' ? 'أنثى' : 'ذكر') as 'ذكر' | 'أنثى',
      motherName: item.motherName || '',
      appointmentDate: item.appointmentDate || '',
      appointmentRef: item.appointmentRef || '',
      currentSchoolDate: item.currentSchoolDate || '',
      lastWorkplace: item.lastWorkplace || '',
      nationalId: item.nationalId || '',
      nationalIdDate: item.nationalIdDate || '',
      status: item.status || 'داوم فعلي',
      phone: item.phone || '',
      address: item.address || '',
      notes: item.notes || ''
    });
    setEditingStaffId(item.id);
    setShowAddForm(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم الموظف بالكامل.');
      return;
    }

    if (editingStaffId) {
      setStaff(prev => prev.map(s => s.id === editingStaffId ? { ...s, ...formData } : s));
    } else {
      const nextSeq = staff.reduce((max, s) => s.seq > max ? s.seq : max, 0) + 1;
      const newStaff: Staff = {
        id: `st-${Date.now()}`,
        seq: nextSeq,
        ...formData
      };
      setStaff(prev => [...prev, newStaff]);
    }

    setShowAddForm(false);
    setFormData(initialFormState);
    setEditingStaffId(null);
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setStaff(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, seq: idx + 1 })));
    }
  };

  const handleCellEdit = (id: string, field: keyof Staff, value: any) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const filteredStaff = staff.filter(s => 
    s.name.includes(searchTerm) || 
    s.jobTitle.includes(searchTerm) || 
    s.phone.includes(searchTerm)
  );

  if (showAddForm) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans select-none" dir="rtl">
        {/* Form Title & Back Button */}
        <div className="flex justify-between items-center pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => { setShowAddForm(false); setEditingStaffId(null); }}
              className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
              title="رجوع للشيت"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                {editingStaffId ? 'تعديل اضبارة موظف' : 'إضافة موظف جديد لقاعدة البيانات'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">يرجى ملء الحقول التالية بعناية، سيتم حفظ الموظف وحساب الخدمة المستمرة تلقائياً.</p>
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
                placeholder="مثال: علي كريم الخفاجي"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* jobTitle */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">العنوان الوظيفي *</label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={e => setFormData(p => ({ ...p, jobTitle: e.target.value }))}
                placeholder="مثال: كاتب، معاون فني، موظف خدمة"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-xs font-bold text-slate-605 mb-1.5">التحصيل الدراسي</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={e => setFormData(p => ({ ...p, qualification: e.target.value }))}
                placeholder="مثال: بكالوريوس"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التولد</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">المعهد أو الكلية المتخرج منها</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData(p => ({ ...p, college: e.target.value }))}
                placeholder="مثال: المعهد التقني ذي قار"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* gradDate */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التخرج</label>
              <input
                type="date"
                value={formData.gradDate}
                onChange={e => setFormData(p => ({ ...p, gradDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الجنس</label>
              <select
                value={formData.gender}
                onChange={e => setFormData(p => ({ ...p, gender: e.target.value as 'ذكر' | 'أنثى' }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
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
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* empNum */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الرقم الوظيفي</label>
              <input
                type="text"
                value={formData.empNum}
                onChange={e => setFormData(p => ({ ...p, empNum: e.target.value }))}
                placeholder="مثال: STAFF123456"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
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
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم البطاقة الوطنية الموحدة</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={e => setFormData(p => ({ ...p, nationalId: e.target.value }))}
                placeholder="رقم البطاقة الوطنية"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* National ID Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ إصدار البطاقة الوطنية</label>
              <input
                type="date"
                value={formData.nationalIdDate}
                onChange={e => setFormData(p => ({ ...p, nationalIdDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ التعيين الأول</label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={e => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Appointment Ref */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم كتاب قرار التعيين</label>
              <input
                type="text"
                value={formData.appointmentRef}
                onChange={e => setFormData(p => ({ ...p, appointmentRef: e.target.value }))}
                placeholder="مثال: ص/١٥٠"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Current School Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تاريخ المباشرة في هذه المدرسة *</label>
              <input
                type="date"
                required
                value={formData.currentSchoolDate}
                onChange={e => setFormData(p => ({ ...p, currentSchoolDate: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Last Workplace */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">آخر مكان عمل</label>
              <input
                type="text"
                value={formData.lastWorkplace}
                onChange={e => setFormData(p => ({ ...p, lastWorkplace: e.target.value }))}
                placeholder="مثال: مديرية تربية ذي قار"
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">حالة الدوام والتنسيب</label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
              >
                <option value="داوم فعلي">داوم فعلي</option>
                <option value="منسب إلى المدرسة">منسب إلى المدرسة</option>
                <option value="منسب من المدرسة">منسب من المدرسة</option>
                <option value="مجاز">مجاز</option>
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
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">ملاحظات إضافية حول الموظف</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="أي معلومات إضافية..."
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-start pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-1.5 py-2 px-6 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              <Save className="h-4 w-4" />
              حفظ المعلومات
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingStaffId(null); }}
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
      
      {/* Header */}
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
              <Briefcase className="h-5.5 w-5.5" />
              <h2 className="text-lg font-bold font-sans">شيت الكادر الإداري والخدمي (الموظفين)</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">ملفات ومعلومات الفنيين، والكتّاب، وإحصاءات الخدمة المستمرة • إعداد وبرمجة: هيثم برزان الزيدي</p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingStaffId(null);
            setShowAddForm(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold cursor-pointer shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          إضافة موظف جديد
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-50/60 rounded-2xl p-4.5 mb-6 border border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 font-sans">البحث السريع في ملفات الإداريين</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الموظف أو وظيفته الحالية..."
            className="block w-full max-w-lg rounded-xl border border-slate-200 bg-white pr-10 pl-3 py-2 text-slate-850 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
          />
          <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Grid container */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner max-w-full overflow-x-auto">
        <table className="w-full text-slate-700 border-collapse text-xs select-text">
          <thead className="bg-[#fbfcff] border-b border-indigo-50 text-[11px] font-bold text-indigo-950">
            <tr>
              <th className="py-3 px-3 text-right bg-slate-50 border-l border-slate-100 w-12">تسلسل</th>
              <th className="py-3 px-4 text-right bg-slate-50 border-l border-slate-100 w-44">اسم الموظف</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">الرقم الوظيفي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">العنوان الوظيفي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100 bg-indigo-50/10">التحصيل الدراسي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">تاريخ المباشرة</th>
              <th className="py-3 px-4 text-center border-l border-slate-100 font-sans bg-indigo-50/15">الخدمة الفعلية (محدث تلقائياً)</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">محل الولادة</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">الجامعة / المعهد</th>
              <th className="py-3 px-3 text-center border-l border-slate-100">اسم الأم الثلاثي</th>
              <th className="py-3 px-3 text-center border-l border-slate-100 font-sans">حالة الدوام والتنسيب</th>
              <th className="py-3 px-3 text-center border-l border-[#f1f5f9]">رقم الهاتف</th>
              <th className="py-3 px-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredStaff.map((person) => {
              const activeService = calculateActiveService(person.currentSchoolDate);
              return (
                <tr key={person.id} className="hover:bg-indigo-55/10">
                  {/* Seq */}
                  <td className="py-2 px-3 font-bold text-center bg-slate-50/30 border-l border-slate-100">
                    {person.seq}
                  </td>

                  {/* Name */}
                  <td className="py-2 px-4 font-bold text-slate-800 border-l border-slate-100">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => handleCellEdit(person.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none text-right font-bold outline-none focus:bg-white rounded p-1"
                    />
                  </td>

                  {/* Emp ID */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={person.empNum}
                      onChange={(e) => handleCellEdit(person.id, 'empNum', e.target.value)}
                      className="w-24 text-center bg-transparent border-none outline-none focus:bg-white rounded font-mono p-1"
                    />
                  </td>

                  {/* Job Title */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={person.jobTitle}
                      onChange={(e) => handleCellEdit(person.id, 'jobTitle', e.target.value)}
                      className="w-24 text-center bg-transparent border-none outline-none focus:bg-white rounded p-1 font-semibold"
                    />
                  </td>

                  {/* Education level */}
                  <td className="py-2 px-3 text-center border-l border-slate-100 bg-indigo-50/5">
                    <input
                      type="text"
                      value={person.qualification}
                      onChange={(e) => handleCellEdit(person.id, 'qualification', e.target.value)}
                      className="w-20 text-center bg-transparent border-none outline-none focus:bg-white rounded font-medium"
                    />
                  </td>

                  {/* Starting Date */}
                  <td className="py-2 px-3 text-center border-l border-slate-100 font-mono text-[11px]">
                    <input
                      type="date"
                      value={person.currentSchoolDate}
                      onChange={(e) => handleCellEdit(person.id, 'currentSchoolDate', e.target.value)}
                      className="bg-transparent border-none text-center text-[10px] focus:bg-white rounded"
                    />
                  </td>

                  {/* Service clock */}
                  <td className="py-2 px-4 text-center font-bold text-slate-800 bg-indigo-50/10 border-l border-slate-100 text-[11px]">
                    <span className="flex items-center gap-1.5 justify-center">
                      <Timer className="h-3.5 w-3.5 text-indigo-600 animate-spin-slow" />
                      {activeService}
                    </span>
                  </td>

                  {/* Birthplace */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={person.birthPlace}
                      onChange={(e) => handleCellEdit(person.id, 'birthPlace', e.target.value)}
                      className="w-24 bg-transparent border-none text-center outline-none"
                    />
                  </td>

                  {/* University / Institute */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={person.college}
                      onChange={(e) => handleCellEdit(person.id, 'college', e.target.value)}
                      className="w-28 bg-transparent border-none text-center"
                    />
                  </td>

                  {/* Mother Name */}
                  <td className="py-2 px-3 text-center border-l border-slate-100">
                    <input
                      type="text"
                      value={person.motherName}
                      onChange={(e) => handleCellEdit(person.id, 'motherName', e.target.value)}
                      className="w-24 bg-transparent border-none text-center outline-none"
                    />
                  </td>

                  {/* Status: Active, secondment */}
                  <td className="py-2 px-3 border-l border-slate- z-10 w-28">
                    <select
                      value={person.status}
                      onChange={(e) => handleCellEdit(person.id, 'status', e.target.value)}
                      className="rounded border border-slate-200 py-1 bg-white text-[10px] w-full"
                    >
                      <option value="داوم فعلي">داوم فعلي</option>
                      <option value="منسب إلى المدرسة">منسب إلى المدرسة</option>
                      <option value="منسب من المدرسة">منسب من المدرسة</option>
                      <option value="مجاز">مجاز</option>
                    </select>
                  </td>

                  {/* Phone */}
                  <td className="py-2 px-3 text-center border-l border-[#f1f5f9] font-mono font-bold text-indigo-800">
                    <input
                      type="text"
                      value={person.phone}
                      onChange={(e) => handleCellEdit(person.id, 'phone', e.target.value)}
                      placeholder="077XXXXXXXX"
                      className="w-24 bg-transparent text-center border-none font-bold outline-none"
                    />
                  </td>

                  {/* Procedures */}
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(person)}
                        title="تعديل التفاصيل بالكامل"
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(person.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer animate-pulse-slow"
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
