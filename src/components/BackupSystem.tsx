/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * System Backup & Recovery Panel - قسم النسخ الاحتياطي والإنعاش المدرسي
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCcw, Download, Upload, CheckCircle2, 
  AlertTriangle, Calendar, Plus, Trash2, ShieldCheck, History 
} from 'lucide-react';
import { Student, Teacher, Staff, SchedulePeriod, ScheduleAllocation, AppSettings } from '../types';

export interface SystemBackup {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  type: 'دوري تلقائي' | 'يدوي يدوي';
  note: string;
  data: {
    students: Student[];
    teachers: Teacher[];
    staff: Staff[];
    schedule: SchedulePeriod[];
    allocations: ScheduleAllocation[];
    settings: AppSettings;
  };
}

interface BackupSystemProps {
  students: Student[];
  setStudents: (s: Student[]) => void;
  teachers: Teacher[];
  setTeachers: (t: Teacher[]) => void;
  staff: Staff[];
  setStaff: (st: Staff[]) => void;
  schedule: SchedulePeriod[];
  setSchedule: (sc: SchedulePeriod[]) => void;
  allocations: ScheduleAllocation[];
  setAllocations: (al: ScheduleAllocation[]) => void;
  settings: AppSettings;
  setSettings: (set: AppSettings) => void;
}

export function BackupSystem({
  students, setStudents,
  teachers, setTeachers,
  staff, setStaff,
  schedule, setSchedule,
  allocations, setAllocations,
  settings, setSettings
}: BackupSystemProps) {
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [customNote, setCustomNote] = useState('');

  // Load backups from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('school_backups');
    if (saved) {
      try {
        setBackups(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading backups', e);
      }
    }
  }, []);

  // Save backups to localStorage whenever they change
  const saveBackupsToStorage = (updatedList: SystemBackup[]) => {
    setBackups(updatedList);
    localStorage.setItem('school_backups', JSON.stringify(updatedList));
  };

  // Helper code to format date-time
  const getArabicDateStr = () => {
    return new Date().toLocaleDateString('ar-IQ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getArabicTimeStr = () => {
    return new Date().toLocaleTimeString('ar-IQ', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Create customized backup
  const handleCreateBackup = (type: 'دوري تلقائي' | 'يدوي يدوي', note: string) => {
    // Collect the comprehensive state
    const backupState: SystemBackup = {
      id: 'backup_' + Date.now(),
      timestamp: Date.now(),
      dateStr: getArabicDateStr(),
      timeStr: getArabicTimeStr(),
      type,
      note,
      data: {
        students,
        teachers,
        staff,
        schedule,
        allocations,
        settings
      }
    };

    const newBackups = [backupState, ...backups];
    saveBackupsToStorage(newBackups);
    showSuccess('تم أخذ نسخة احتياطية آمنة من كافة السجلات واللوائح!');
    setCustomNote('');
  };

  // Delete specific backup
  const handleDeleteBackup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية نهائياً؟')) return;
    const filtered = backups.filter(b => b.id !== id);
    saveBackupsToStorage(filtered);
    showSuccess('تم حذف ملف النسخة الاحتياطية بنجاح.');
  };

  // Restore state from a specific backup
  const handleRestoreBackup = (backup: SystemBackup) => {
    const confirmed = window.confirm(`⚠️ تحذير أمان مدرسي حساس:\nهل تريد استرجاع النسخة المؤرشفة بتاريخ [${backup.dateStr} - ${backup.timeStr}]؟\nسيتم حذف البيانات الحالية واستبدالها بالنسخة المحددة.`);
    if (!confirmed) return;

    try {
      const { data } = backup;
      
      // Update states
      if (data.students) setStudents(data.students);
      if (data.teachers) setTeachers(data.teachers);
      if (data.staff) setStaff(data.staff);
      if (data.schedule) setSchedule(data.schedule);
      if (data.allocations) setAllocations(data.allocations);
      if (data.settings) setSettings(data.settings);

      // Force save items immediately to localStorage to survive page refresh
      if (data.students) localStorage.setItem('school_students', JSON.stringify(data.students));
      if (data.teachers) localStorage.setItem('school_teachers', JSON.stringify(data.teachers));
      if (data.staff) localStorage.setItem('school_staff', JSON.stringify(data.staff));
      if (data.schedule) localStorage.setItem('school_schedule', JSON.stringify(data.schedule));
      if (data.allocations) localStorage.setItem('school_allocations', JSON.stringify(data.allocations));
      if (data.settings) localStorage.setItem('school_settings', JSON.stringify(data.settings));

      showSuccess(`تمت استعادة السجلات واللوائح بنجاح وتفعيل نسخة [${backup.dateStr}] بنجاح مذهل!`);
    } catch (err: any) {
      showError('فشل في استعادة البيانات، قد تكون هذه النسخة غير متوافقة.');
    }
  };

  // Export backup to a single JSON file for offline disaster safety
  const handleExportFile = (backup: SystemBackup) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `School_Backup_${backup.timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showSuccess('تم تحميل الملف وتصديره بنجاح لدعم الطوارئ المدرسي!');
    } catch (err) {
      showError('فشل تصدير الملف الاحتياطي!');
    }
  };

  // Import / Upload backup from file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        // Basic schema verification
        if (importedData && importedData.data && importedData.data.settings) {
          const newBackup: SystemBackup = {
            ...importedData,
            id: 'backup_imp_' + Date.now(),
            note: 'مستوردة خارجيًا: ' + (importedData.note || 'بدون تفصيل')
          };
          const updated = [newBackup, ...backups];
          saveBackupsToStorage(updated);
          showSuccess('تم استيراد النسخة الاحتياطية الخارجية بنجاح وإضافتها لقائمة الأرشيف!');
        } else {
          showError('القمة المدخلة غير صحيحة لا تطابق نمط النسخ الاحتياطي المعتمد للطائرة المدرسي.');
        }
      } catch (err) {
        showError('فشل قراءة الملف أو فك شفرة البيانات!');
      }
    };
    fileReader.readAsText(files[0]);
    // Reset file input
    e.target.value = '';
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4500);
  };

  // Auto trigger daily backup if not present for today
  useEffect(() => {
    if (students.length === 0) return; // Wait for initial app state load
    const saved = localStorage.getItem('school_backups');
    let loadedBackups: SystemBackup[] = [];
    if (saved) {
      try {
        loadedBackups = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    const todayDateStr = getArabicDateStr();
    // Check if there is already an auto-backup for today
    const hasTodayBackup = loadedBackups.some(b => b.dateStr === todayDateStr && b.type === 'دوري تلقائي');

    if (!hasTodayBackup) {
      // Trigger silent automatic daily backup
      const backupState: SystemBackup = {
        id: 'backup_auto_' + Date.now(),
        timestamp: Date.now(),
        dateStr: todayDateStr,
        timeStr: getArabicTimeStr(),
        type: 'دوري تلقائي',
        note: 'نسخة دورية يومية تلقائية للحماية من الأعطال',
        data: {
          students,
          teachers,
          staff,
          schedule,
          allocations,
          settings
        }
      };
      
      const updated = [backupState, ...loadedBackups];
      setBackups(updated);
      localStorage.setItem('school_backups', JSON.stringify(updated));
      console.log('Automated school backup complete for today:', todayDateStr);
    }
  }, [students, teachers, staff, schedule, allocations, settings]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 font-sans">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-900 mb-1 font-sans">
            <Database className="h-6 w-6 text-indigo-700 animate-pulse-slow" />
            <h2 className="text-xl font-bold">الأرشفة والنسخ الاحتياطي والإنعاش الوطني للبيانات</h2>
          </div>
          <p className="text-xs text-slate-400">نظام حماية شامل يقوم بأخذ نسخ يومية تلقائية، مع دعم لملفات الحفظ اليدوي والاستعادة السريعة للأخطاء</p>
        </div>
      </div>

      {/* Action Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border-r-4 border-emerald-500 text-emerald-850 p-4 rounded-xl text-xs font-bold mb-6 animate-fade-in/70 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-750 p-4 rounded-xl text-xs font-bold mb-6 animate-fade-in/70 flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Manual backup creator + Upload section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-sans">
        
        {/* Card 1: Live Manual Trigger */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <Plus className="h-4 w-4 text-indigo-600" />
            إنشاء نقطة استرجاع (نسخة يدوية)
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            قبل إجراء أي تعديلات مصيرية (مثل ترحيل الطلاب أو الفروع)، ينصح بشدة بالاحتفاظ بنسخة يدوية لاستعادتها فوراً في حالة الخطأ.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="وصف أو ملاحظة النسخة (مثال: قبل الترحيل)"
              className="block w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleCreateBackup('يدوي يدوي', customNote.trim() || 'نسخة يدوية مثبتة')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow"
            >
              <Database className="h-3.5 w-3.5" />
              أرشفة وحفظ البيانات الحالية
            </button>
          </div>
        </div>

        {/* Card 2: Offline File Backup uploading/downloading */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <Upload className="h-4 w-4 text-emerald-600" />
            استيراد نسخة خارجية مسبقة
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            محمية تماماً للتنقل! قم برفع ملف نسخة احتياطية من الحاسبة الشخصية بصيغة JSON لإدراجها مجدداً في السجل المدرسي للمنصة.
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors shadow-sm">
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              اختيار ورفع ملف الحفظ
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            <span className="text-[9px] text-slate-400 text-center">أقصى حجم للملف المدعوم: ٤ ميجابايت • الامتداد (.json)</span>
          </div>
        </div>

        {/* Card 3: Health Status */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3.5">
          <h3 className="text-xs font-bold text-emerald-850 flex items-center gap-1.5 border-b border-emerald-200/60 pb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 animate-bounce" />
            حالة حماية سلامة النظام الموحد
          </h3>
          <div className="text-[11px] text-emerald-700 space-y-2.5 font-medium leading-relaxed">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>النسخ التلقائي: <strong>مفعل ونشط يومياً</strong></span>
            </div>
            <div>
              <span>النسخة التلقائية لليوم:</span>{' '}
              <span className="text-emerald-800 underline font-semibold">
                {backups.some(b => b.dateStr === getArabicDateStr() && b.type === 'دوري تلقائي') ? 'مؤمنة بالكامل ✓' : 'جارٍ معالجتها...'}
              </span>
            </div>
            <p className="text-[10px] text-slate-450 leading-relaxed">
              * يقوم الهاتف السحابي بحفظ نسخة تصفيرية جديدة بصورة دورية كل ٢٤ ساعة تلقائيًا بمجرد دخولك إلى حساب الإعدادية.
            </p>
          </div>
        </div>

      </div>

      {/* Backups List / Archive */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-600 flex items-center gap-1.5 border-b border-rose-100/50 pb-2">
          <History className="h-4 w-4 text-indigo-750" />
          سجل وأرشيف النسخ الاحتياطية المتاحة للإنعاش ({backups.length} نسخة)
        </h3>

        {backups.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto space-y-2">
            <Database className="h-10 w-10 text-slate-350 mx-auto" />
            <p className="text-[11px] font-bold text-slate-600">لا يوجد نسخ محفوظة حالياً في أرشيف السحابة المحلية</p>
            <p className="text-[10px] text-slate-400">سيتم إنشاء نسخة تلقائية جديدة فوراً عند تسجيل الدخول أو عند النقر على "أرشفة البيانات"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {backups.map((backup) => (
              <div 
                key={backup.id}
                className="group relative border border-slate-100 hover:border-indigo-300 rounded-2xl bg-white p-4 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                onClick={() => handleRestoreBackup(backup)}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 bottom-0 w-1.5 rounded-r-2xl ${
                  backup.type === 'دوري تلقائي' ? 'bg-emerald-500' : 'bg-indigo-550'
                }`}></div>

                {/* Info block */}
                <div className="space-y-2.5 pr-3">
                  <div className="flex justify-between items-start font-sans">
                    <div>
                      <span className={`inline-block py-0.5 px-2 rounded-md text-[9px] font-extrabold mb-1.5 ${
                        backup.type === 'دوري تلقائي' 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : 'bg-indigo-50 text-indigo-800'
                      }`}>
                        {backup.type}
                      </span>
                      <h4 className="text-[11.5px] font-extrabold text-slate-800 leading-none">
                        التاريخ: {backup.dateStr}
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-1 font-mono">
                        الوقت: {backup.timeStr}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-slate-50/50 p-2 rounded-lg font-medium leading-relaxed border border-slate-100/50">
                    {backup.note}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 pr-3 font-sans">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRestoreBackup(backup); }}
                    className="text-[10px] text-indigo-700 hover:text-indigo-900 font-extrabold flex items-center gap-1 cursor-pointer bg-indigo-50/50 py-1 px-2.5 rounded-lg border border-indigo-100/50 hover:bg-indigo-50"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    تفعيل واستعادة هذه النسخة
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleExportFile(backup); }}
                      title="تنزيل وتصدير ملف النسخة"
                      className="p-1 px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBackup(backup.id, e)}
                      title="حذف هذه النسخة"
                      className="p-1 px-2 text-rose-500 hover:text-rose-800 hover:bg-rose-50 border border-rose-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Hover Quick Tip */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 text-[8.5px] text-indigo-500 font-extrabold transition-opacity pointer-events-none">
                  انقر للاستعادة السريعة والتحويل
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
