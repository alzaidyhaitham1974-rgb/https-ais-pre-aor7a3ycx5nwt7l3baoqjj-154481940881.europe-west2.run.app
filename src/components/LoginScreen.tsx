/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, RefreshCw, Key } from 'lucide-react';
import { AppSettings } from '../types';

interface LoginScreenProps {
  settings: AppSettings;
  onLoginSuccess: () => void;
  themeStyle: 'classic' | 'scientific_3d';
  setThemeStyle: (style: 'classic' | 'scientific_3d') => void;
}

export function LoginScreen({ settings, onLoginSuccess, themeStyle, setThemeStyle }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showBackup, setShowBackup] = useState(false);
  
  // Custom secret toggle details
  const [showSecretKey, setShowSecretKey] = useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Custom credential storage
  const [storedCredentials, setStoredCredentials] = useState({
    user: 'admin',
    pass: '1234'
  });
  
  // Backup security key generated for fallback recovery
  const [backupKey, setBackupKey] = useState(() => {
    const randomNum1 = Math.floor(1000 + Math.random() * 9000);
    const randomNum2 = Math.floor(1000 + Math.random() * 9000);
    return `RECOVER-${randomNum1}-${randomNum2}`;
  });
  const [enteredBackup, setEnteredBackup] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleDevClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    clickCountRef.current += 1;
    
    // Auto reset click count if user stops tapping for 3 seconds
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);

    if (clickCountRef.current >= 5) {
      setShowSecretKey((curr) => !curr);
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    }
  };

  useEffect(() => {
    const savedCreds = localStorage.getItem('school_login_creds');
    if (savedCreds) {
      setStoredCredentials(JSON.parse(savedCreds));
    }
    const savedBackup = localStorage.getItem('school_backup_key');
    if (savedBackup) {
      setBackupKey(savedBackup);
    } else {
      localStorage.setItem('school_backup_key', backupKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === storedCredentials.user && password === storedCredentials.pass) {
      setError('');
      onLoginSuccess();
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور. يرجى المحاولة مجدداً.');
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredBackup === backupKey) {
      const updated = {
        user: newUsername.trim() || 'admin',
        pass: newPassword.trim() || '1234'
      };
      setStoredCredentials(updated);
      localStorage.setItem('school_login_creds', JSON.stringify(updated));
      setRecoverySuccess(true);
      setError('');
      setTimeout(() => {
        setShowBackup(false);
        setRecoverySuccess(false);
        setEnteredBackup('');
        setNewUsername('');
        setNewPassword('');
      }, 3000);
    } else {
      setError('مفتاح الاسترجاع غير مطابق!');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 font-sans select-none transition-all duration-500 ease-in-out ${
      themeStyle === 'scientific_3d' 
        ? 'theme-scientific-3d bg-[#f4f7f5] text-slate-800' 
        : 'theme-classic bg-slate-50 text-slate-800'
    }`} dir="rtl">
      
      {/* 🏷️ Interactive 3D/Classic Style Swapper inside Login Screen */}
      <div className={`mb-6 flex items-center gap-2 p-1.5 rounded-2xl border shadow-xl select-none z-10 ${
        themeStyle === 'scientific_3d'
          ? 'bg-emerald-50/50 border-emerald-100/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)]'
          : 'bg-slate-900/90 border-slate-700/50'
      }`}>
        <button
          type="button"
          onClick={() => setThemeStyle('classic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
            themeStyle === 'classic'
              ? 'bg-slate-800 text-white shadow-md border border-slate-700/30'
              : themeStyle === 'scientific_3d'
                ? 'text-slate-500 hover:text-emerald-950'
                : 'text-slate-400 hover:text-white'
          }`}
        >
          🏢 الكلاسيكي الأصلي
        </button>
        <button
          type="button"
          onClick={() => setThemeStyle('scientific_3d')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-301 flex items-center gap-1.5 cursor-pointer ${
            themeStyle === 'scientific_3d'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white shadow-[0_3px_12px_rgba(16,185,129,0.25)] border border-amber-500/20 font-extrabold'
              : 'text-slate-400 hover:text-emerald-700'
          }`}
        >
          ✨ الأثيري الزمردي والذهبي
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        
        {/* Card Header with School Emblem */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white px-8 py-10 text-center relative animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
          
          <div className="mx-auto w-32 h-32 flex items-center justify-center mb-4 overflow-visible select-none">
            {settings.logoUrl && settings.logoUrl.trim().startsWith('<svg') ? (
              <div className="w-full h-full flex items-center justify-center p-0.5" dangerouslySetInnerHTML={{ __html: settings.logoUrl }} />
            ) : (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain mix-blend-multiply filter contrast-125 brightness-110 drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)] transition-transform duration-300 hover:scale-105" referrerPolicy="no-referrer" />
            )}
          </div>
          
          <h2 className="login-school-title text-xl font-bold tracking-tight mb-1">{settings.schoolName}</h2>
          <p className="text-emerald-200/80 text-xs">منصة الإدارة التربوية والتعليمية المتكاملة</p>
        </div>

        {/* Card Body */}
        <div className="p-8">
          {!showBackup ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">تسجيل الدخول للنظام</h3>
              
              {error && (
                <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-700 p-3 text-xs rounded-lg flex items-center gap-2">
                  <span className="font-semibold">تنبيه:</span> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">اسم المستخدم</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="اسم المستخدم"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-all shadow-md shadow-emerald-700/10 focus:ring-2 focus:ring-emerald-500/20 active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                دخول آمن للمنصة
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setShowBackup(true); setError(''); }}
                  className="text-xs text-slate-400 hover:text-emerald-700 transition-all underline cursor-pointer"
                >
                  نسيت اسم المستخدم أو كلمة المرور؟
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-emerald-800">
                <RefreshCw className="h-5 w-5 animate-spin-slow" />
                <h3 className="text-md font-bold">استرجاع صلاحية الدخول</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                الرجاء إدخال رمز الاسترجاع المولد مسبقاً لإعادة ضبط الحساب.
                {showSecretKey && (
                  <span className="block mt-2 font-semibold text-amber-800 bg-amber-50/75 border border-amber-200/60 p-2.5 rounded-xl text-center select-text">
                    رمز الاسترجاع الخاص بك هو: <strong className="font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-amber-300 text-slate-800 select-all">{backupKey}</strong>
                  </span>
                )}
              </p>

              {error && (
                <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-700 p-3 text-xs rounded-lg font-medium">
                  {error}
                </div>
              )}

              {recoverySuccess && (
                <div className="bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 p-3 text-xs rounded-lg font-medium">
                  تم استعادة الحساب وضبط بيانات الدخول بنجاح! جاري العودة...
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">مفتاح الاسترجاع</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={enteredBackup}
                    onChange={(e) => setEnteredBackup(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 pr-9 pl-3 py-2 text-slate-800 text-xs focus:border-emerald-500 focus:bg-white"
                    placeholder="رمز الاسترجاع الخاص بك"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">اسم مستخدم جديد</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-xs"
                    placeholder="اسم المستخدم الجديد"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">كلمة مرور جديدة</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-xs"
                    placeholder="كلمة المرور الجديدة"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-all pointer-events-auto cursor-pointer"
                >
                  تأكيد وإعادة ضبط
                </button>
                <button
                  type="button"
                  onClick={() => { setShowBackup(false); setError(''); }}
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition-all cursor-pointer"
                >
                  إلغاء الخروج
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom copyright detail */}
        <div className="bg-slate-50 px-8 py-4.5 border-t border-slate-100 text-center space-y-1">
          <p className="text-[10px] text-slate-400 font-medium select-none">الإصدار 5.2.0 • جميع الحقوق محفوظة لجمهورية العراق - وزارة التربية</p>
          <p 
            onClick={handleDevClick}
            className="text-[10px] text-slate-500 font-bold select-none cursor-pointer hover:text-emerald-700 transition-colors inline-block"
          >
            إعداد وبرمجة: هيثم برزان الزيدي
          </p>
          {showSecretKey && (
            <div className="mt-1.5 p-2 bg-amber-50/70 text-amber-800 border border-amber-200/60 rounded-xl text-[10px] font-semibold select-text text-center animate-pulse">
              مفتاح استرجاع النظام: <span className="font-mono font-extrabold select-all bg-white px-1.5 py-0.5 rounded shadow-sm border border-amber-300">{backupKey}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
