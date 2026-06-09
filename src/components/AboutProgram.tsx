import React from 'react';
import { Award, Heart, ShieldCheck, Mail, Globe, Code, FileText, User } from 'lucide-react';

export function AboutProgram() {
  return (
    <div className="bg-white rounded-3xl border border-emerald-500/15 shadow-md p-6 md:p-8 space-y-8 animate-fade-in-up font-sans text-slate-850 select-text" id="about-program-container">
      
      {/* 🌟 Elegant Islamic and Tech Blend Header */}
      <div className="relative overflow-hidden text-center rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 border border-emerald-700 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-xl mb-2 animate-pulse">
            <Heart className="h-8 w-8 text-amber-400" fill="currentColor" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">بوابة الأثير • حول النظام والبرنامج الإداري</h2>
          <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-medium">
            نظام رقمي وطني متكامل مصمم لهندسة إدارة وإحصاء "الإعدادية المركزية للبنين" - ذي قار، الناصرية.
          </p>
        </div>
      </div>

      {/* 📜 Heartfelt dedication section */}
      <div className="p-6 md:p-8 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
          <span className="text-xl">🕌</span>
          <h3 className="text-sm md:text-base font-extrabold text-amber-900">إهداء مبارك وطلب الدعاء والرحمة</h3>
        </div>
        
        <p className="text-xs md:text-sm text-slate-700 leading-loose text-justify font-medium bg-white/70 backdrop-blur border border-amber-500/10 p-5 rounded-xl shadow-inner">
          « اسألكم الدعاء لي ولوالدي وقراءة سورة الفاتحة المباركة تسبقها الصلاة على محمد وال محمد الطيبين الطاهرين واهداء ثوابها الى روح والدي ووالدتي وارواح المؤمنين والمؤمنات ومن لم يذكرهم ذاكر »
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-amber-100/50 p-4 rounded-xl border border-amber-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500/15 rounded-full flex items-center justify-center text-amber-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-semibold">معد ومبرمج النظام</span>
              <strong className="text-xs md:text-sm text-amber-900 font-black">الأستاذ هيثم برزان الزيدي</strong>
            </div>
          </div>
          
          <div className="text-slate-500 text-[10px] font-semibold text-center sm:text-left">
            رحم الله من قرأ سورة الفاتحة وأهدى ثوابها لروح والديّ الكريمين
          </div>
        </div>
      </div>

      {/* 🚀 System Technical Summary & Intent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1: Program Overview */}
        <div className="p-5 rounded-2xl border border-emerald-500/10 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-emerald-800">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Code className="h-5 w-5" />
            </div>
            <h4 className="text-xs md:text-sm font-extrabold">نبذة تقنية عن البرنامج</h4>
          </div>
          <p className="text-[11px] md:text-xs text-slate-650 leading-relaxed">
            تم تطوير هذا النظام بإستخدام أحدث تقنيات الويب السريعة والآمنة لتسهيل العمل الإداري المدرسي، ورصد درجات الطلاب، وطباعة الهويات والنتائج، وصباغة الكتب والمخاطبات الرسمية، وضمان الفعالية التامة في أقصر وقت ممكن وخلف شبكات أمان وحفظ مدمجة.
          </p>
        </div>

        {/* Module 2: System Capabilities */}
        <div className="p-5 rounded-2xl border border-emerald-500/10 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-teal-800">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-xs md:text-sm font-extrabold">المزايا والحفظ الفائق</h4>
          </div>
          <p className="text-[11px] md:text-xs text-slate-650 leading-relaxed">
            يدعم النظام حماية الولوج بكلمة المرور المشفرة ورموز الاسترجاع لضمان عدم دخول أي أطراف غير مصرح لها. كما يسهّل الترحيل السنوي، الرصد الذكي، وحفظ النسخ الاحتياطية سحابياً ومحلياً لعامة الملاك التربوي بصورة مرنة ومحمية بالكامل.
          </p>
        </div>

      </div>

      {/* 🏢 Ministry Reference Brand Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-400 select-none">
        <div>
          <p className="font-bold text-slate-700">جمهورية العراق • وزارة التربية العراقية</p>
          <p className="text-[10px] text-slate-400 mt-1">منصة التنمية الإدارية والإنتاجية الرقمية المكتملة</p>
        </div>
        <div className="text-[10px] text-slate-450 font-semibold bg-slate-50 border border-slate-150 rounded-xl px-4.5 py-2">
          الإعدادية المركزية للبنين • ذي قار
        </div>
      </div>

    </div>
  );
}
