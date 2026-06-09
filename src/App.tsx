/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Award, CreditCard, UserCheck, Briefcase, Calendar, Mail, 
  Database, Search, ArrowRightLeft, Settings, LogOut, LayoutDashboard, Users,
  Info, Laptop
} from 'lucide-react';

// Import Types and Constants
import { Student, Teacher, Staff, SchedulePeriod, ScheduleAllocation, AppSettings } from './types';
import { 
  SAMPLE_STUDENTS, SAMPLE_TEACHERS, SAMPLE_STAFF, INITIAL_SCHEDULE, 
  INITIAL_ALLOCATIONS, INITIAL_SETTINGS 
} from './constants';
import { recalculateStudentGrades } from './utils';

// Import Components
import { LoginScreen } from './components/LoginScreen';
import { StudentGrades } from './components/StudentGrades';
import { StudentResults } from './components/StudentResults';
import { StudentReportCards } from './components/StudentReportCards';
import { TeachersInfo } from './components/TeachersInfo';
import { StaffInfo } from './components/StaffInfo';
import { ScheduleSheet } from './components/ScheduleSheet';
import { LetterGenerator } from './components/LetterGenerator';
import { DataEntryForm } from './components/DataEntryForm';
import { SearchSystem } from './components/SearchSystem';
import { RolloverSystem } from './components/RolloverSystem';
import { SettingsPanel } from './components/SettingsPanel';
import { BackupSystem } from './components/BackupSystem';
import { AboutProgram } from './components/AboutProgram';
import { DesktopInstaller } from './components/DesktopInstaller';

type TabType = 'grades_sheet' | 'results_sheet' | 'report_cards' | 'teachers_info' | 'staff_info' | 'schedule_allocations' | 'letter_generator' | 'data_entry' | 'rollover' | 'search' | 'settings' | 'backup' | 'about_program' | 'desktop_app';

const DASHBOARD_MODULES = [
  {
    id: 'report_cards' as TabType,
    title: 'نتائج الطلاب (البطاقات المدرسية)',
    description: 'عرض ومراجعة درجات الطلاب الفردية وطباعة الشهادات والنتائج المدرسية النهائية.',
    icon: CreditCard,
    badge: 'الشهادات والنتائج',
    color: 'from-emerald-500 to-teal-600',
    highlightColor: 'rgba(16, 185, 129, 0.45)'
  },
  {
    id: 'grades_sheet' as TabType,
    title: 'شيت درجات الطلاب (١٨٠٠ طالب)',
    description: 'رصد شامل للدرجات لجميع الصفوف الدراسية والفصول مع الفرز والفلترة الذكية والسريعة.',
    icon: FileSpreadsheet,
    badge: 'السجلات والدرجات',
    color: 'from-cyan-500 to-blue-600',
    highlightColor: 'rgba(6, 182, 212, 0.45)'
  },
  {
    id: 'results_sheet' as TabType,
    title: 'شيت نتائج الطلاب الكلي',
    description: 'قائمة النتائج النهائية التراكمية، الإحصائيات العامة، ومستويات النجاح العامة والقرار.',
    icon: Award,
    badge: 'الإحصائيات الكلية',
    color: 'from-amber-500 to-yellow-600',
    highlightColor: 'rgba(245, 158, 11, 0.45)'
  },
  {
    id: 'teachers_info' as TabType,
    title: 'شيت معلومات المدرسين',
    description: 'إدارة ملفات الهيئة التدريسية، الاختصاصات، الحصص والمواد المسندة للكادر التعليمي.',
    icon: UserCheck,
    badge: 'الكادر التعليمي',
    color: 'from-teal-600 to-emerald-700',
    highlightColor: 'rgba(20, 184, 166, 0.45)'
  },
  {
    id: 'staff_info' as TabType,
    title: 'شيت معلومات الموظفين',
    description: 'تنظيم بيانات الملاك الإداري، الحضور والغياب، وتوزيع المسؤوليات الرسمية بمرونة.',
    icon: Briefcase,
    badge: 'الملاك الإداري',
    color: 'from-indigo-500 to-cyan-600',
    highlightColor: 'rgba(99, 102, 241, 0.45)'
  },
  {
    id: 'schedule_allocations' as TabType,
    title: 'توزيع الحصص والجدول الأسبوعي',
    description: 'منظم الجدول المدرسي الأسبوعي وتوزيع الحصص والعمل الفني والإشراف اليومي.',
    icon: Calendar,
    badge: 'الجدول الأسبوعي',
    color: 'from-rose-500 to-pink-600',
    highlightColor: 'rgba(244, 63, 94, 0.45)'
  },
  {
    id: 'letter_generator' as TabType,
    title: 'منشئ المخاطبات والكتب الرسمية',
    description: 'توليد المخاطبات الإدارية والخطابات الثبوتية وكتب الشكر والتقدير بجهود سريعة.',
    icon: Mail,
    badge: 'صياغة المراسلات',
    color: 'from-sky-500 to-blue-600',
    highlightColor: 'rgba(14, 165, 233, 0.45)'
  },
  {
    id: 'data_entry' as TabType,
    title: 'رصد قيد وإدخال جديد مدمج',
    description: 'نافذة الإدخال السريع والموحد لتثبيت طالب، مدرس، أو موظف إداري جديد في ثوانٍ معدودة.',
    icon: Database,
    badge: 'رصد البيانات اليدوية',
    color: 'from-purple-500 to-indigo-600',
    highlightColor: 'rgba(168, 85, 247, 0.45)'
  },
  {
    id: 'search' as TabType,
    title: 'محرك البحث في معلومات الطالب',
    description: 'البحث الفوري المتطور في سجلات وملفات الطلاب والأساتذة بطرق بحث مرنة.',
    icon: Search,
    badge: 'البحث الفوري والفلترة',
    color: 'from-blue-600 to-teal-500',
    highlightColor: 'rgba(37, 99, 235, 0.45)'
  },
  {
    id: 'rollover' as TabType,
    title: 'معالج ترحيل الطلاب ونهاية العام',
    description: 'ترحيل وحفظ الأرشيف الكلي لنهاية العام وبداية دورة دراسية جديدة وآمنة.',
    icon: ArrowRightLeft,
    badge: 'معالج ترحيل الطلاب',
    color: 'from-orange-500 to-red-650',
    highlightColor: 'rgba(249, 115, 22, 0.45)'
  },
  {
    id: 'settings' as TabType,
    title: 'الإعدادات واللجنة المانحة للقرار',
    description: 'إعدادات النظام المتقدمة، معلومات الإعدادية المركزية وشعارها ولائحة الحدود للقرار.',
    icon: Settings,
    badge: 'التحكم الإداري المتقدم',
    color: 'from-slate-650 to-slate-800',
    highlightColor: 'rgba(100, 116, 139, 0.45)'
  },
  {
    id: 'backup' as TabType,
    title: 'النسخ الاحتياطي والأرشفة اليومية',
    description: 'حفظ واسترجاع النسخ وتصدير قاعدة البيانات لضمان أعلى مستويات الأمان والأرشفة.',
    icon: Database,
    badge: 'دعم وأرشفة البيانات',
    color: 'from-emerald-600 to-teal-800',
    highlightColor: 'rgba(16, 185, 129, 0.45)'
  },
  {
    id: 'desktop_app' as TabType,
    title: 'تنزيل وتثبيت نسخة سطح المكتب (EXE)',
    description: 'دليل شامل لتثبيت المنصة كبرنامج مستقل على شاشة حاسوبك الشخصي وتوليد ملف EXE مستقل كبقية البرامج.',
    icon: Laptop,
    badge: 'برنامج سطح المكتب',
    color: 'from-blue-600 to-indigo-700',
    highlightColor: 'rgba(59, 130, 246, 0.45)'
  },
  {
    id: 'about_program' as TabType,
    title: 'تطوير وحول البرنامج الإداري',
    description: 'نبذة عن فكرة البرنامج، معلومات المبرمج، وإهداء ثواب الفاتحة لروح والديّ الكريمين.',
    icon: Info,
    badge: 'إهداء مبارك ومعلومات',
    color: 'from-amber-600 to-amber-800',
    highlightColor: 'rgba(217, 119, 6, 0.45)'
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('report_cards');
  
  // Custom interactive layout style switcher (Classic vs Scientific 3D)
  const [themeStyle, setThemeStyle] = useState<'classic' | 'scientific_3d'>(() => {
    return (localStorage.getItem('school_app_theme_style') as 'classic' | 'scientific_3d') || 'classic';
  });

  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('school_app_theme_style', themeStyle);
  }, [themeStyle]);

  // Real Persistent State hooks loaded from LocalStorage
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [schedule, setSchedule] = useState<SchedulePeriod[]>([]);
  const [allocations, setAllocations] = useState<ScheduleAllocation[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Initialize and load persistent memory
  useEffect(() => {
    const s_std = localStorage.getItem('school_students');
    const s_tch = localStorage.getItem('school_teachers');
    const s_stf = localStorage.getItem('school_staff');
    const s_sch = localStorage.getItem('school_schedule');
    const s_all = localStorage.getItem('school_allocations');
    const s_set = localStorage.getItem('school_settings');

    let loadedSettings = INITIAL_SETTINGS;
    if (s_set) {
      try {
        loadedSettings = JSON.parse(s_set);
        // Automatically migrate users using the outdated school logo image path or default settings to our brand-new glorious high-res SVG
        let updated = false;
        if (!loadedSettings.logoUrl || loadedSettings.logoUrl.includes('school_logo') || !loadedSettings.logoUrl.trim().startsWith('<svg')) {
          loadedSettings.logoUrl = INITIAL_SETTINGS.logoUrl;
          updated = true;
        }
        if (!loadedSettings.currentAcademicYear) {
          loadedSettings.currentAcademicYear = INITIAL_SETTINGS.currentAcademicYear || '2026-2027';
          updated = true;
        }
        if (!loadedSettings.previousAcademicYear) {
          loadedSettings.previousAcademicYear = INITIAL_SETTINGS.previousAcademicYear || '2025-2026';
          updated = true;
        }
        if (updated) {
          localStorage.setItem('school_settings', JSON.stringify(loadedSettings));
        }
        setSettings(loadedSettings);
      } catch (e) {
        console.error('Error parsing settings', e);
      }
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('school_settings', JSON.stringify(INITIAL_SETTINGS));
    }

    if (s_std) {
      try {
        const parsed: Student[] = JSON.parse(s_std);
        const upgraded = parsed.map(student => {
          const activeSubs = loadedSettings.allowedSubjects[student.className] || [];
          return recalculateStudentGrades(student, loadedSettings.decisionLimit, activeSubs);
        });
        setStudents(upgraded);
      } catch (e) {
        console.error('Error parsing students', e);
        setStudents(SAMPLE_STUDENTS);
      }
    } else {
      setStudents(SAMPLE_STUDENTS);
      localStorage.setItem('school_students', JSON.stringify(SAMPLE_STUDENTS));
    }

    if (s_tch) setTeachers(JSON.parse(s_tch));
    else {
      setTeachers(SAMPLE_TEACHERS);
      localStorage.setItem('school_teachers', JSON.stringify(SAMPLE_TEACHERS));
    }

    if (s_stf) setStaff(JSON.parse(s_stf));
    else {
      setStaff(SAMPLE_STAFF);
      localStorage.setItem('school_staff', JSON.stringify(SAMPLE_STAFF));
    }

    if (s_sch) setSchedule(JSON.parse(s_sch));
    else {
      setSchedule(INITIAL_SCHEDULE);
      localStorage.setItem('school_schedule', JSON.stringify(INITIAL_SCHEDULE));
    }

    if (s_all) setAllocations(JSON.parse(s_all));
    else {
      setAllocations(INITIAL_ALLOCATIONS);
      localStorage.setItem('school_allocations', JSON.stringify(INITIAL_ALLOCATIONS));
    }

    // Auto login for development state if needed, but we provide secure credential checks
    const s_auth = localStorage.getItem('school_auth');
    if (s_auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync to database LocalStorage
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('school_students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (teachers.length > 0) {
      localStorage.setItem('school_teachers', JSON.stringify(teachers));
    }
  }, [teachers]);

  useEffect(() => {
    if (staff.length > 0) {
      localStorage.setItem('school_staff', JSON.stringify(staff));
    }
  }, [staff]);

  useEffect(() => {
    if (schedule.length > 0) {
      localStorage.setItem('school_schedule', JSON.stringify(schedule));
    }
  }, [schedule]);

  useEffect(() => {
    if (allocations.length > 0) {
      localStorage.setItem('school_allocations', JSON.stringify(allocations));
    }
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem('school_settings', JSON.stringify(settings));
  }, [settings]);

  // Recalculate all students dynamically in real-time whenever the decision limit or allowed subjects change
  useEffect(() => {
    if (students.length > 0) {
      setStudents(prevStudents => {
        let changed = false;
        const updated = prevStudents.map(student => {
          const activeSubs = settings.allowedSubjects[student.className] || [];
          const calculated = recalculateStudentGrades(student, settings.decisionLimit, activeSubs);
          
          if (JSON.stringify(calculated.grades) !== JSON.stringify(student.grades) || calculated.overallResult !== student.overallResult) {
            changed = true;
            return calculated;
          }
          return student;
        });
        return changed ? updated : prevStudents;
      });
    }
  }, [settings.decisionLimit, settings.allowedSubjects]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('school_auth');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('school_auth', 'true');
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        settings={settings} 
        onLoginSuccess={handleLoginSuccess} 
        themeStyle={themeStyle} 
        setThemeStyle={setThemeStyle} 
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-500 ease-in-out ${
      themeStyle === 'scientific_3d' 
        ? 'theme-scientific-3d bg-[#f4f7f5] text-slate-800' 
        : 'theme-classic bg-[#f8fafc] text-slate-800'
    }`} dir="rtl">
      
      {/* 1. Suite Navigation Header (Hidden on print layouts) */}
      <header className={`py-4 px-6 relative z-30 select-none print:hidden border-b transition-all duration-500 ${
        themeStyle === 'scientific_3d'
          ? 'bg-white/95 text-slate-800 border-emerald-500/15 backdrop-blur-md shadow-[0_4px_24px_rgba(16,185,129,0.05)]'
          : 'bg-slate-900 text-white shadow-md border-white/10'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 flex items-center justify-center overflow-visible shrink-0 select-none">
              {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
                <div className="w-full h-full flex items-center justify-center p-0.5" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
              ) : (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain mix-blend-multiply filter contrast-125 brightness-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]" referrerPolicy="no-referrer" />
              )}
            </div>
            <div>
              <h1 className={`text-md sm:text-base font-extrabold tracking-tight leading-none ${
                themeStyle === 'scientific_3d' ? 'text-emerald-900' : 'text-emerald-100'
              }`}>{settings.schoolName}</h1>
              <p className={`text-[10px] mt-1 ${themeStyle === 'scientific_3d' ? 'text-slate-550' : 'text-slate-400'}`}>نظام إدارة المدرسة الذكي المتكامل للطلاب والكادر</p>
            </div>
          </div>

          {/* 🏷️ Interactive 3D/Classic Style Swapper Row */}
          <div className={`flex items-center gap-2 p-1 rounded-2xl border select-none shrink-0 ${
            themeStyle === 'scientific_3d' 
              ? 'bg-emerald-50/50 border-emerald-100/40' 
              : 'bg-slate-950/60 border-slate-800 shadow-inner'
          }`}>
            <button
              onClick={() => setThemeStyle('classic')}
              className={`px-3.5 py-1.5 rounded-xl text-[10.5px] font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                themeStyle === 'classic'
                  ? 'bg-slate-800 text-white shadow-md shadow-black/40 border border-slate-700/30'
                  : themeStyle === 'scientific_3d'
                    ? 'text-slate-500 hover:text-emerald-900 hover:bg-emerald-50/70'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 الكلاسيكي الأصلي
            </button>
            <button
              onClick={() => setThemeStyle('scientific_3d')}
              className={`px-3.5 py-1.5 rounded-xl text-[10.5px] font-bold transition-all duration-305 flex items-center gap-1.5 cursor-pointer ${
                themeStyle === 'scientific_3d'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white shadow-[0_3px_12px_rgba(16,185,129,0.25)] border border-amber-500/20 font-extrabold'
                  : 'text-emerald-450/80 hover:text-emerald-300 hover:bg-emerald-950/20'
              }`}
            >
              ✨ الأثيري الزمردي والذهبي
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left hidden md:block">
              <span className={`block text-[10px] font-semibold mb-0.5 ${themeStyle === 'scientific_3d' ? 'text-slate-500' : 'text-slate-400'}`}>سجل دخولك بصفتك:</span>
              <strong className={`text-xs font-bold ${themeStyle === 'scientific_3d' ? 'text-slate-800' : 'text-white'}`}>{settings.principalName}</strong>
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                themeStyle === 'scientific_3d'
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100 hover:border-rose-200'
                  : 'bg-white/5 hover:bg-white/10 text-rose-300 hover:text-rose-100 border-transparent hover:border-white/10'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>خروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Desk Workspace Containers */}
      {themeStyle === 'scientific_3d' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative z-10 select-none">
          {isMainMenu ? (
            /* 🪐 Aetherial Horizon 3D Dashboard */
            <div className="w-full space-y-8 animate-fade-in-up">
              
              {/* Top Banner introducing the premium system */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50/30 border border-emerald-500/15 shadow-md relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-emerald-900 leading-tight">بوابة الأثير الرقمية لـ {settings.schoolName}</h2>
                    <p className="text-slate-650 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                      مرحباً بك مجدداً حضرة المدير <strong className="text-amber-700 font-extrabold">{settings.principalName}</strong> في الواجهة الأثيرية المبتكرة لعام {settings.currentAcademicYear}. 
                      انقر على أي من الأقسام التفاعلية المسردة أدناه للدخول للوحة التحكم والمزامنة الكاملة.
                    </p>
                  </div>
                  
                  {/* Digital Live Stats banner inside top row */}
                  <div className="bg-white/95 border border-emerald-500/12 rounded-2xl p-4 flex gap-6 shrink-0 shadow-sm w-full md:w-auto justify-around">
                    <div className="text-center">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">الطلاب</span>
                      <strong className="text-lg font-black text-emerald-600 font-mono">{students.length}</strong>
                    </div>
                    <div className="w-px bg-slate-205/60 self-stretch"></div>
                    <div className="text-center">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">المدرسين</span>
                      <strong className="text-lg font-black text-indigo-600 font-mono">{teachers.length}</strong>
                    </div>
                    <div className="w-px bg-slate-205/60 self-stretch"></div>
                    <div className="text-center">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">الموظفين</span>
                      <strong className="text-lg font-black text-amber-600 font-mono">{staff.length}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Horizontal 3D stereoscopic card section grid */}
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-emerald-500/10 pb-3">
                  <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                    <span className="text-amber-600 text-lg">✦</span>
                    أقسام المنصة الأثيرية الفورية
                  </h3>
                  <span className="text-[10px] text-slate-600 bg-emerald-50/50 border border-emerald-100 px-2.5 py-1 rounded-xl">مجموع الأقسام المكتملة: {DASHBOARD_MODULES.length}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {DASHBOARD_MODULES.map((module) => {
                    const IconComponent = module.icon;
                    return (
                      <div
                        key={module.id}
                        onClick={() => {
                          setActiveTab(module.id);
                          setIsMainMenu(false);
                        }}
                        style={{ '--glow-color': module.highlightColor } as React.CSSProperties}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white border border-emerald-500/15 hover:border-amber-500/35 cursor-pointer shadow-md hover:shadow-[0_12px_24px_rgba(16,185,129,0.06),0_0_15px_var(--glow-color)] transition-all duration-300 transform hover:-translate-y-1 select-none overflow-hidden"
                      >
                        {/* Golden backdrop lens flare effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        
                        {/* Elevated 3D horizontal Icon container */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-md border border-white/15 shrink-0 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-305`}>
                          <IconComponent className="h-5.5 w-5.5" />
                        </div>
                        
                        {/* Card metadata Text columns */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-[12.5px] font-extrabold text-slate-800 group-hover:text-emerald-850 transition-colors truncate">
                              {module.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-slate-500 group-hover:text-slate-700 transition-colors line-clamp-2 leading-relaxed">
                            {module.description}
                          </p>
                        </div>
                        
                        {/* Interactive symbol indicator */}
                        <div className="text-slate-400 group-hover:text-amber-600 transition-colors pl-1 shrink-0 select-none">
                          <span className="text-xs">◀</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secondary brand showcase credits block inside 3D layout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border border-emerald-500/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right select-none shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700">نظام الإشعاع والتحكّم الفوري المتقدم للوزارة الفنية</h4>
                  <p className="text-[10px] text-slate-500">تمت هندستها بصفتها واجهة وطنية متطورة لخدمة الإعدادية المركزية للبنين وكادرها المدرسي المتميز.</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-500/10 text-[10.5px] font-semibold text-slate-500 shadow-sm">
                    الاستاذ: <strong className="text-emerald-700 font-extrabold">هيثم برزان الزيدي</strong>
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            /* 🖥️ Dedicated Full screen Workspace layout inside Aetherial theme with Main Menu back bar */
            <div className="w-full space-y-5 animate-fade-in-up">
              
              {/* Back to main module menu command bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-emerald-500/15 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-600">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-950">القسم الحالي: {DASHBOARD_MODULES.find(m => m.id === activeTab)?.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">يمكنك الرجوع لجميع الأقسام وقائمة الاختيارات بنقرة واحدة أدناه.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMainMenu(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] border border-emerald-400/30 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📋</span>
                  <span>العودة للقائمة الرئيسية</span>
                </button>
              </div>

              {/* Main Expanded Custom Content Viewport */ }
              <main className="w-full font-sans text-xs select-text">
                {activeTab === 'report_cards' && (
                  <StudentReportCards students={students} settings={settings} />
                )}
                {activeTab === 'grades_sheet' && (
                  <StudentGrades students={students} setStudents={setStudents} settings={settings} />
                )}
                {activeTab === 'results_sheet' && (
                  <StudentResults students={students} setStudents={setStudents} settings={settings} />
                )}
                {activeTab === 'teachers_info' && (
                  <TeachersInfo teachers={teachers} setTeachers={setTeachers} settings={settings} />
                )}
                {activeTab === 'staff_info' && (
                  <StaffInfo staff={staff} setStaff={setStaff} settings={settings} />
                )}
                {activeTab === 'schedule_allocations' && (
                  <ScheduleSheet 
                    schedule={schedule} 
                    setSchedule={setSchedule} 
                    allocations={allocations} 
                    setAllocations={setAllocations}
                    teachers={teachers}
                  />
                )}
                {activeTab === 'letter_generator' && (
                  <LetterGenerator 
                    settings={settings} 
                    teachers={teachers} 
                    staff={staff} 
                    students={students} 
                  />
                )}
                {activeTab === 'data_entry' && (
                  <DataEntryForm 
                    students={students} 
                    setStudents={setStudents} 
                    teachers={teachers} 
                    setTeachers={setTeachers} 
                    staff={staff} 
                    setStaff={setStaff}
                    decisionLimit={settings.decisionLimit}
                  />
                )}
                {activeTab === 'search' && (
                  <SearchSystem 
                    students={students} 
                    teachers={teachers} 
                    staff={staff} 
                    allocations={allocations} 
                  />
                )}
                {activeTab === 'rollover' && (
                  <RolloverSystem 
                    students={students} 
                    setStudents={setStudents} 
                    settings={settings}
                    setSettings={setSettings}
                  />
                )}
                {activeTab === 'settings' && (
                  <SettingsPanel settings={settings} setSettings={setSettings} />
                )}
                {activeTab === 'backup' && (
                  <BackupSystem 
                    students={students} 
                    setStudents={setStudents} 
                    teachers={teachers} 
                    setTeachers={setTeachers} 
                    staff={staff} 
                    setStaff={setStaff} 
                    schedule={schedule} 
                    setSchedule={setSchedule} 
                    allocations={allocations} 
                    setAllocations={setAllocations} 
                    settings={settings} 
                    setSettings={setSettings} 
                  />
                )}
                {activeTab === 'about_program' && (
                  <AboutProgram />
                )}
                {activeTab === 'desktop_app' && (
                  <DesktopInstaller />
                )}
              </main>

            </div>
          )}
        </div>
      ) : (
        /* 🏢 Classic 2-Columns Side-by-Side Viewport Layout */
        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 items-start relative z-10 select-none">
          
          {/* Navigation Control Sidebar (Hidden on print layouts) */}
          <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 shrink-0 space-y-5 print:hidden select-none">
            
            <div className="border-b border-slate-150 pb-3 mb-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-emerald-700" />
                أقسام المنصة الإدارية
              </h3>
            </div>

            {/* Navigation Buttons Stack */}
            <nav className="flex flex-col gap-1 text-xs">
              
              {/* Student grade reporting trigger card */}
              <button
                onClick={() => setActiveTab('report_cards')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'report_cards' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <CreditCard className="h-4.5 w-4.5" />
                <span>نتائج الطلاب (البطاقات المدرسية)</span>
              </button>

              <button
                onClick={() => setActiveTab('grades_sheet')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'grades_sheet' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <FileSpreadsheet className="h-4.5 w-4.5" />
                <span>شيت درجات الطلاب (١٨٠٠ طالب)</span>
              </button>

              <button
                onClick={() => setActiveTab('results_sheet')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'results_sheet' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Award className="h-4.5 w-4.5" />
                <span>شيت نتائج الطلاب الكلي</span>
              </button>

              <button
                onClick={() => setActiveTab('teachers_info')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'teachers_info' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <UserCheck className="h-4.5 w-4.5" />
                <span>شيت معلومات المدرسين</span>
              </button>

              <button
                onClick={() => setActiveTab('staff_info')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'staff_info' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Briefcase className="h-4.5 w-4.5" />
                <span>شيت معلومات الموظفين</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule_allocations')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'schedule_allocations' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>توزيع الحصص والجدول الأسبوعي</span>
              </button>

              <button
                onClick={() => setActiveTab('letter_generator')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'letter_generator' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Mail className="h-4.5 w-4.5" />
                <span>منشئ المخاطبات والكتب الرسمية</span>
              </button>

              <button
                onClick={() => setActiveTab('data_entry')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'data_entry' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Database className="h-4.5 w-4.5" />
                <span>رصد قيد وإدخال جديد مدمج</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'search' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Search className="h-4.5 w-4.5" />
                <span>محرك البحث في معلومات الطالب</span>
              </button>

              <button
                onClick={() => setActiveTab('rollover')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'rollover' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <ArrowRightLeft className="h-4.5 w-4.5" />
                <span>معالج ترحيل الطلاب ونهاية العام</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Settings className="h-4.5 w-4.5" />
                <span>الإعدادات واللجنة المانحة للقرار</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'backup' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Database className="h-4.5 w-4.5" />
                <span>النسخ الاحتياطي والأرشفة اليومية</span>
              </button>

              <button
                onClick={() => setActiveTab('desktop_app')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'desktop_app' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Laptop className="h-4.5 w-4.5" />
                <span>تنزيل وتثبيت نسخة سطح المكتب (EXE)</span>
              </button>

              <button
                onClick={() => setActiveTab('about_program')}
                className={`w-full text-right py-3 px-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === 'about_program' 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Info className="h-4.5 w-4.5" />
                <span>حول البرنامج والمعرّف ومبارك الإهداء</span>
              </button>

            </nav>

            {/* Core metadata statistics brief list */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 block border-b border-slate-150 pb-1.5 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                أعداد القيود النشطة بالملف
              </span>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500">مجموع الملفات الطلابية:</span>
                <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">{students.length}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500">ملاك الكادر التدريسي:</span>
                <span className="font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">{teachers.length}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500">أعداد الموظفين النشطين:</span>
                <span className="font-mono bg-[#fef3c7] text-amber-800 px-1.5 py-0.5 rounded">{staff.length}</span>
              </div>
            </div>

            {/* Developer Credit Box */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-4.5 border border-emerald-800 shadow-md">
              <div className="text-[10px] text-emerald-300 font-extrabold mb-1">تطوير وبرمجة النظام</div>
              <div className="text-xs font-extrabold tracking-tight">هيثم برزان الزيدي</div>
              <div className="text-[10px] text-emerald-250/80 mt-1 font-semibold leading-relaxed">إعداد وبرمجة • الملاك الفني</div>
            </div>

          </aside>

          {/* 3. Main Dynamic Canvas content viewport */}
          <main className="flex-1 w-full font-sans text-xs select-text">
            {activeTab === 'report_cards' && (
              <StudentReportCards students={students} settings={settings} />
            )}
            {activeTab === 'grades_sheet' && (
              <StudentGrades students={students} setStudents={setStudents} settings={settings} />
            )}
            {activeTab === 'results_sheet' && (
              <StudentResults students={students} setStudents={setStudents} settings={settings} />
            )}
            {activeTab === 'teachers_info' && (
              <TeachersInfo teachers={teachers} setTeachers={setTeachers} settings={settings} />
            )}
            {activeTab === 'staff_info' && (
              <StaffInfo staff={staff} setStaff={setStaff} settings={settings} />
            )}
            {activeTab === 'schedule_allocations' && (
              <ScheduleSheet 
                schedule={schedule} 
                setSchedule={setSchedule} 
                allocations={allocations} 
                setAllocations={setAllocations}
                teachers={teachers}
              />
            )}
            {activeTab === 'letter_generator' && (
              <LetterGenerator 
                settings={settings} 
                teachers={teachers} 
                staff={staff} 
                students={students} 
              />
            )}
            {activeTab === 'data_entry' && (
              <DataEntryForm 
                students={students} 
                setStudents={setStudents} 
                teachers={teachers} 
                setTeachers={setTeachers} 
                staff={staff} 
                setStaff={setStaff}
                decisionLimit={settings.decisionLimit}
              />
            )}
            {activeTab === 'search' && (
              <SearchSystem 
                students={students} 
                teachers={teachers} 
                staff={staff} 
                allocations={allocations} 
              />
            )}
            {activeTab === 'rollover' && (
              <RolloverSystem 
                students={students} 
                setStudents={setStudents} 
                settings={settings}
                setSettings={setSettings}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsPanel settings={settings} setSettings={setSettings} />
            )}
            {activeTab === 'backup' && (
              <BackupSystem 
                students={students} 
                setStudents={setStudents} 
                teachers={teachers} 
                setTeachers={setTeachers} 
                staff={staff} 
                setStaff={setStaff} 
                schedule={schedule} 
                setSchedule={setSchedule} 
                allocations={allocations} 
                setAllocations={setAllocations} 
                settings={settings} 
                setSettings={setSettings} 
              />
            )}
            {activeTab === 'about_program' && (
              <AboutProgram />
            )}
            {activeTab === 'desktop_app' && (
              <DesktopInstaller />
            )}
          </main>

        </div>
      )}

      {/* Global Interactive Footer (hidden on prints) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4.5 px-6 mt-12 text-slate-400 text-xs print:hidden z-10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <div>
            <p className="font-semibold text-slate-300">نظام الإدارة المدرسية الموحد لجمهورية العراق - الإعدادية المركزية للبنين</p>
            <p className="text-[10px] text-slate-500 mt-1">الإصدار 5.2.0 • جميع الحقوق محفوظة لوزارة التربية العراقية</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl px-4.5 py-2 flex items-center gap-2">
            <span className="text-[10px] text-slate-550 font-medium">الجهد الهندسي والبرمجي للبرنامج:</span>
            <strong className="text-emerald-400 font-extrabold">هيثم برزان الزيدي (إعداد وبرمجة)</strong>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
