/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Lock, Eye, CheckCircle2, Award, ListFilter, Sliders, ShieldCheck } from 'lucide-react';
import { AppSettings, SubjectKey } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  // Lock PIN protection as requested
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states matching current settings
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [principalName, setPrincipalName] = useState(settings.principalName);
  const [principalTitle, setPrincipalTitle] = useState(settings.principalTitle);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [decisionLimit, setDecisionLimit] = useState<5 | 10>(settings.decisionLimit);
  const [allowedSubjects, setAllowedSubjects] = useState(settings.allowedSubjects);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(settings.currentAcademicYear || '2026-2027');
  const [previousAcademicYear, setPreviousAcademicYear] = useState(settings.previousAcademicYear || '2025-2026');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default system security code
    if (pin === '2002') {
      setIsLocked(false);
      setPinError('');
    } else {
      setPinError('رمز الحماية غير صحيح! يرجى إدخال الرزم الموحد الصحيح (٢٠٠٢).');
    }
  };

  const handleSave = () => {
    setSettings({
      schoolName,
      principalName,
      principalTitle,
      logoUrl,
      decisionLimit,
      allowedSubjects,
      currentAcademicYear,
      previousAcademicYear
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggleSubject = (className: 'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي', subject: string) => {
    const currentList = allowedSubjects[className];
    const updatedList = currentList.includes(subject)
      ? currentList.filter(s => s !== subject)
      : [...currentList, subject];
    
    setAllowedSubjects(prev => ({
      ...prev,
      [className]: updatedList
    }));
  };

  if (isLocked) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md mx-auto font-sans" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          
          <div>
            <h3 className="text-md font-bold text-slate-900">حماية قسم الإعدادات</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              هذا القسم يحتوي على خيارات التحكم بحد قرار الدرجات (٥ أو ١٠ درجات) وتسميات المدرسة والمدير. يتطلب رمز حماية خاص.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            {pinError && (
              <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-700 text-xs p-3 rounded-lg font-medium text-right">
                {pinError}
              </div>
            )}

            <div className="text-right">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">أدخل رمز الدخول للإعدادات والمطابقات</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-3 py-2.5 text-center font-mono outline-none text-slate-800 font-extrabold focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              تأكيد الدخول الآمن
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-900 mb-1 font-sans">
            <Settings className="h-6 w-6 text-indigo-700" />
            <h2 className="text-xl font-bold">لوحة التحكم بإعدادات النظام والمواد</h2>
          </div>
          <p className="text-xs text-slate-400">تعديل معلومات الإعدادية، درجات القرار الموثقة، ومجموع المواد الدراسية لكل مرحلة</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer font-sans"
        >
          <CheckCircle2 className="h-4 w-4" />
          حفظ وتعديل الإعدادات
        </button>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border-r-4 border-emerald-500 text-emerald-850 p-4.5 rounded-xl text-xs font-bold font-sans mb-6 animate-fade-in/70">
          تم تحديث كشوفات وإعدادات الإعدادية والقرار بنجاح عبر الفروع!
        </div>
      )}

      {/* Configuration tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-sans">
        
        {/* Left Side: Text Fields */}
        <div className="space-y-4 text-xs font-bold text-slate-500">
          <h3 className="text-xs font-extrabold text-slate-550 border-b border-slate-100 pb-2 flex items-center gap-1">
            <Sliders className="h-4 w-4 text-indigo-700" />
            بيانات ختم التوقيع والمدرسة والمشرفين
          </h3>

          <div>
            <label className="block mb-1">اسم المدرسة الرائد</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-750 font-normal outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1">رمز أو رابط شعار المدرسة (لتطبيقه على كافة البرنامج)</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-750 font-mono text-[10px] outline-none focus:border-indigo-500"
              placeholder="/src/assets/images/school_logo_official_1780921501892.png"
            />
          </div>

          <div>
            <label className="block mb-1">اسم مدير المدرسة المسؤول (الختم)</label>
            <input
              type="text"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-755 font-normal outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">الصفة والعنوان الوظيفي للمدير</label>
            <input
              type="text"
              value={principalTitle}
              onChange={(e) => setPrincipalTitle(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-755 font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">العام الدراسي الحالي</label>
              <input
                type="text"
                value={currentAcademicYear}
                onChange={(e) => setCurrentAcademicYear(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-755 font-semibold outline-none text-center"
                placeholder="2026-2027"
              />
            </div>
            <div>
              <label className="block mb-1">العام الدراسي السابق</label>
              <input
                type="text"
                value={previousAcademicYear}
                onChange={(e) => setPreviousAcademicYear(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-755 font-semibold outline-none text-center"
                placeholder="2025-2026"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">درجات القرار الصادرة من وزارة التربية</label>
            <select
              value={decisionLimit}
              onChange={(e: any) => setDecisionLimit(Number(e.target.value) as 5 | 10)}
              className="block w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 text-xs"
            >
              <option value={5}>٥ درجات قرار (نظام الإضافة المتناقصة من ٤٩ لغاية ٤٥)</option>
              <option value={10}>١٠ درجات قرار (ممتدة لتشمل الإضافات التراكمية)</option>
            </select>
            <p className="text-[10px] text-slate-400 font-normal mt-1 leading-relaxed">
              * سيتم تفعيل القرار بنظام الإضافة المتناقصة تباعاً على درجات الطلاب في بطاقات رصد النتائج.
            </p>
          </div>
        </div>

        {/* Right Side: Subjects matrix per class as requested */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-550 border-b border-slate-100 pb-2 flex items-center gap-1">
            <ListFilter className="h-4 w-4 text-emerald-700" />
            توزيع وتخصيص المواد الدراسية لكل مرحلة
          </h3>

          <div className="space-y-4">
            {(['الرابع العلمي', 'الخامس العلمي', 'السادس العلمي'] as const).map(className => (
              <div key={className} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                <span className="text-[11px] font-extrabold text-indigo-950 block mb-2.5">{className}</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  {Object.values(SubjectKey).map(sub => {
                    const isChecked = allowedSubjects[className].includes(sub);
                    return (
                      <div
                        key={sub}
                        onClick={() => handleToggleSubject(className, sub)}
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all select-none ${
                          isChecked 
                            ? 'bg-emerald-50/30 border-emerald-250 text-emerald-800 font-bold' 
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-3.5 h-3.5 focus:ring-0 rounded"
                        />
                        <span className="text-[10px]">{sub}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
