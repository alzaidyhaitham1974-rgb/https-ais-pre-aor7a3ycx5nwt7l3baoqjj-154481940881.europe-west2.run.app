/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, ShieldAlert, BadgeInfo, Star, CheckSquare } from 'lucide-react';
import { SchedulePeriod, ScheduleAllocation, Teacher } from '../types';

interface ScheduleSheetProps {
  schedule: SchedulePeriod[];
  setSchedule: React.Dispatch<React.SetStateAction<SchedulePeriod[]>>;
  allocations: ScheduleAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<ScheduleAllocation[]>>;
  teachers: Teacher[];
}

export function ScheduleSheet({ schedule, setSchedule, allocations, setAllocations, teachers }: ScheduleSheetProps) {
  const [newAllocName, setNewAllocName] = useState('');
  const [newAllocPeriods, setNewAllocPeriods] = useState<number>(12);

  const handleCellEdit = (dayIndex: number, periodField: 'class1' | 'class2' | 'class3' | 'class4' | 'class5' | 'class6', value: string) => {
    setSchedule(prev => prev.map((item, idx) => idx === dayIndex ? { ...item, [periodField]: value } : item));
  };

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllocName.trim()) return;

    const newAlloc: ScheduleAllocation = {
      id: `all-${Date.now()}`,
      teacherName: newAllocName.trim(),
      totalPeriods: newAllocPeriods,
      classesTaught: ['الرابع العلمي', 'الخامس العلمي'],
      periodsPerSection: { 'أ': 4, 'ب': 4, 'ج': 4 }
    };

    setAllocations(prev => [...prev, newAlloc]);
    setNewAllocName('');
  };

  const handleDeleteAlloc = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  const handleAllocationEdit = (id: string, field: keyof ScheduleAllocation, value: any) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Weekly Schedule Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 text-emerald-800 mb-2 border-b border-slate-100 pb-4">
          <Calendar className="h-6 w-6 animate-pulse-slow" />
          <div>
            <h2 className="text-xl font-bold">جدول الحصص الأسبوعي الإجمالي</h2>
            <p className="text-xs text-slate-400">توزيع الحصص الدراسية الست اليومية من الأحد للخميس</p>
          </div>
        </div>

        <div className="border border-slate-100 rounded-2xl overflow-hidden max-w-full overflow-x-auto shadow-inner">
          <table className="w-full text-slate-700 border-collapse text-xs select-text">
            <thead className="bg-[#fbfcff] border-b border-slate-100 text-[11px] font-bold text-slate-600">
              <tr className="text-center">
                <th className="py-3 px-4 text-right bg-slate-50 border-l border-slate-100 w-24">اليوم</th>
                <th className="py-3 px-3 border-l border-slate-100 bg-emerald-50/15">الحصة الأولى</th>
                <th className="py-3 px-3 border-l border-slate-100">الحصة الثانية</th>
                <th className="py-3 px-3 border-l border-slate-100 bg-emerald-50/15">الحصة الثالثة</th>
                <th className="py-3 px-3 border-l border-slate-100">الحصة الرابعة</th>
                <th className="py-3 px-3 border-l border-slate-100 bg-emerald-50/15">الحصة الخامسة</th>
                <th className="py-3 px-3 text-center">الحصة السادسة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-center font-sans">
              {schedule.map((item, index) => (
                <tr key={item.day} className="hover:bg-slate-50/30">
                  {/* Day cell */}
                  <td className="py-3 px-4 text-right font-bold text-slate-800 bg-slate-50 border-l border-slate-100">
                    {item.day}
                  </td>
                  
                  {/* Periods inputs */}
                  {['class1', 'class2', 'class3', 'class4', 'class5', 'class6'].map((field, cellIdx) => {
                    const typedField = field as 'class1' | 'class2' | 'class3' | 'class4' | 'class5' | 'class6';
                    return (
                      <td key={field} className={`py-1 px-1 border-l border-slate-100 ${cellIdx % 2 === 0 ? 'bg-emerald-50/5' : ''}`}>
                        <input
                          type="text"
                          value={item[typedField] || ''}
                          onChange={(e) => handleCellEdit(index, typedField, e.target.value)}
                          className="w-full bg-transparent border-none text-center outline-none focus:bg-white focus:ring-1 focus:ring-emerald-555 p-1 rounded font-medium text-[11px] text-slate-800"
                          placeholder="المدرس - المادة - الصف"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Teachers Lesson Allocations Sheet */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-900 mb-1">
              <Clock className="h-5 w-5 text-indigo-700 font-extrabold" />
              <h3 className="text-lg font-bold">جدول توزيع واستحقاق الحصص على المدارس والمدرسين</h3>
            </div>
            <p className="text-xs text-slate-400">تحليل نصاب المدرسين، المراحل الدراسية المغطاة، ومجموع الحصص في شعب (أ، ب، ج)</p>
          </div>

          <form onSubmit={handleAddAllocation} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={newAllocName}
              onChange={(e) => setNewAllocName(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 w-full sm:w-48"
              required
            >
              <option value="">اختر المدرس لرصد الحصص...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
              ))}
            </select>
            <input
              type="number"
              value={newAllocPeriods}
              onChange={(e) => setNewAllocPeriods(Number(e.target.value))}
              placeholder="نصاب الحصص"
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs outline-none text-center font-bold w-20"
              min="1"
              required
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs active:scale-98 cursor-pointer shadow-md"
            >
              رصد استحقاق
            </button>
          </form>
        </div>

        {/* Allocations Breakdown Grid */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden max-w-full overflow-x-auto">
          <table className="w-full text-slate-700 border-collapse text-xs select-text">
            <thead className="bg-[#fcfdfe] border-b border-indigo-50 text-[11px] font-bold text-slate-600">
              <tr>
                <th className="py-2.5 px-4 text-right bg-slate-50 border-l border-slate-100 w-44">اسم المدرس</th>
                <th className="py-2.5 px-3 text-center border-l border-slate-100 bg-indigo-55/10">مجموع الحصص الكلية</th>
                <th className="py-2.5 px-4 text-center border-l border-slate-100">الصفوف الدراسية المغطاة</th>
                <th className="py-2.5 px-3 text-center border-l border-slate-100">شعبة (أ)</th>
                <th className="py-2.5 px-3 text-center border-l border-slate-100">شعبة (ب)</th>
                <th className="py-2.5 px-3 text-center border-l border-slate-100">شعبة (ج)</th>
                <th className="py-2.5 px-3 text-center border-l border-[#f1f5f9]">ملاحظات حالة الكادر</th>
                <th className="py-2.5 px-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocations.map((alloc) => {
                // Find matching teacher to reference real-time active status
                const matchedTeacher = teachers.find(t => t.name === alloc.teacherName);
                const statusStr = matchedTeacher ? matchedTeacher.status : 'داوم فعلي';
                const jobTitleStr = matchedTeacher ? matchedTeacher.jobTitle : 'مدرس';

                return (
                  <tr key={alloc.id} className="hover:bg-indigo-55/5">
                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-slate-850 border-l border-slate-100">
                      {alloc.teacherName}
                      <span className="block text-[9px] text-slate-400 font-normal">{jobTitleStr}</span>
                    </td>

                    {/* Total periods */}
                    <td className="py-3 px-3 text-center border-l border-slate-100 font-bold bg-indigo-50/20 text-indigo-950 font-mono text-sm">
                      <input
                        type="number"
                        value={alloc.totalPeriods}
                        onChange={(e) => handleAllocationEdit(alloc.id, 'totalPeriods', Number(e.target.value))}
                        className="w-16 text-center bg-transparent border-none outline-none font-extrabold focus:bg-white rounded"
                      />
                    </td>

                    {/* Classes list */}
                    <td className="py-3 px-4 border-l border-slate-100">
                      <span className="text-[10px] font-sans font-semibold text-slate-500">
                        {alloc.classesTaught.join('، ')}
                      </span>
                    </td>

                    {/* Division A */}
                    <td className="py-3 px-3 text-center border-l border-slate-100 font-mono">
                      <input
                        type="number"
                        value={alloc.periodsPerSection['أ'] ?? 0}
                        onChange={(e) => {
                          const updated = { ...alloc.periodsPerSection, 'أ': Number(e.target.value) };
                          handleAllocationEdit(alloc.id, 'periodsPerSection', updated);
                        }}
                        className="w-12 text-center bg-transparent border-none outline-none"
                      />
                    </td>

                    {/* Division B */}
                    <td className="py-3 px-3 text-center border-l border-slate-100 font-mono">
                      <input
                        type="number"
                        value={alloc.periodsPerSection['ب'] ?? 0}
                        onChange={(e) => {
                          const updated = { ...alloc.periodsPerSection, 'ب': Number(e.target.value) };
                          handleAllocationEdit(alloc.id, 'periodsPerSection', updated);
                        }}
                        className="w-12 text-center bg-transparent border-none outline-none"
                      />
                    </td>

                    {/* Division C */}
                    <td className="py-3 px-3 text-center border-l border-slate-100 font-mono">
                      <input
                        type="number"
                        value={alloc.periodsPerSection['ج'] ?? 0}
                        onChange={(e) => {
                          const updated = { ...alloc.periodsPerSection, 'ج': Number(e.target.value) };
                          handleAllocationEdit(alloc.id, 'periodsPerSection', updated);
                        }}
                        className="w-12 text-center bg-transparent border-none"
                      />
                    </td>

                    {/* Status Alert Badge */}
                    <td className="py-3 px-3 text-center border-l border-[#f1f5f9] font-sans">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        statusStr === 'داوم فعلي' ? 'bg-emerald-100 text-emerald-800' :
                        statusStr.includes('منسب') ? 'bg-amber-100 text-amber-900 border border-amber-300/30' :
                        'bg-red-100 text-red-900 border border-red-300/30'
                      }`}>
                        {statusStr}
                      </span>
                    </td>

                    {/* Procedures */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteAlloc(alloc.id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
