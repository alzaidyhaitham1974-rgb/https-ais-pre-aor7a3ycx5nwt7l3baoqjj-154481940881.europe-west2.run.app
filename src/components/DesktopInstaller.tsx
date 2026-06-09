import React, { useState, useEffect } from 'react';
import { Laptop, Download, Terminal, Check, Copy, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

export function DesktopInstaller() {
  const [copiedText, setCopiedText] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  const sharedAppUrl = "https://ais-pre-aor7a3ycx5nwt7l3baoqjj-154481940881.europe-west2.run.app";
  const packagerCommand = `npx -y nativefier --name "منصة الإدارة التربوية" --single-instance --platform windows --arch x64 "${sharedAppUrl}"`;

  useEffect(() => {
    // Listen for the PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running as standalone (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePwaInstallClick = async () => {
    if (!deferredPrompt) {
      alert("⚠️ ميزة التثبيت المباشر مدعومة في متصفحات Google Chrome و Microsoft Edge. يرجى النقر على أيقونة التثبيت (شاشة صغيرة مع سهم لأسفل) التي تظهر بجانب شريط الرابط في أعلى المتصفح للتثبيت الفوري.");
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(packagerCommand);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-500/15 shadow-md p-6 md:p-8 space-y-8 animate-fade-in-up font-sans text-slate-850 select-text" id="desktop-installer-container">
      
      {/* 🌟 Elegant Arabic Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-8 border border-blue-700/35 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-505/15 border border-blue-500/30 text-xs text-blue-350 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              تكامل سطح المكتب والتشغيل الفوري
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
              تثبيت المنصة كبرنامج لسطح المكتب للكمبيوتر (EXE)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
              أهلاً بك الأستاذ <strong className="text-amber-400 font-extrabold">هيثم برزان الزيدي</strong>. لقد قمنا بتجهيز المنصة بالكامل لتعمل كبرنامج تفاعلي مستقل على شاشة حاسوبك الشخصي دون الحاجة لفتح المتصفح في كل مرة.
            </p>
          </div>
          <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-300 shadow-2xl shrink-0">
            <Laptop className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 💻 Section 1: Instant PWA Desktop Application (No download needed!) */}
        <div className="p-6 md:p-7 rounded-2xl border border-emerald-500/15 bg-emerald-50/10 hover:bg-emerald-50/20 transition-all duration-300 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
                <Laptop className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-black text-emerald-900">
                  الطريقة الأولى: التثبيت الفوري كبرنامج تقدّمي (موصى بها)
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">سريعة • خفيفة • تدعم العمل أوفلاين كلياً</span>
              </div>
            </div>

            <p className="text-[11.5px] leading-relaxed text-slate-650">
              بصفتنا قمنا ببرمجة النظام كمنصة متكاملة وتثبيت ملفات <span className="font-mono bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded text-[10.5px]">manifest.json</span> و <span className="font-mono bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded text-[10.5px]">Service Worker</span>، يمكنك تثبيتها فوراً لتظهر على ديسكتوب حاسوبك بضغطة زر واحدة.
            </p>

            <div className="bg-white/80 p-4.5 rounded-xl border border-slate-150 space-y-3.5">
              <h4 className="text-[11.5px] font-bold text-slate-800">💡 كيفية المباشرة بالتثبيت:</h4>
              <ul className="space-y-2.5 text-[10.5px] text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-extrabold">١.</span>
                  <span>افتح هذا الرابط في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong> على كمبيوترك.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-extrabold">٢.</span>
                  <span>ستلاحظ ظهور أيقونة تثبيت صغيرة (شاشة حاسوب بها سهم هابط) في شريط الرابط العلوي بأقصى اليمين/اليسار.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-extrabold">٣.</span>
                  <span>انقر على زر <strong>"تثبيت / Install"</strong> لتظهر المنصة في نافذة كلاسيكية جميلة مستقلة، وتضع أيقونة المنصة الرسمية على سطح المكتب فوراً!</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-500/10">
            {isPwaInstalled ? (
              <div className="w-full p-3 rounded-xl bg-emerald-100/60 text-emerald-800 text-center font-bold text-[11px] flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                <span>البرنامج مثبت بالفعل على حاسوبك الآن!</span>
              </div>
            ) : (
              <button
                onClick={handlePwaInstallClick}
                className="w-full py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-[12px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_6px_20px_rgba(4,120,87,0.45)] cursor-pointer"
              >
                <Download className="h-4.5 w-4.5" />
                <span>ابدأ تثبيت المنصة على سطح المكتب الآن</span>
              </button>
            )}
          </div>
        </div>

        {/* 🛠️ Section 2: Convert to Standalone EXE & Windows Setup Installer */}
        <div className="p-6 md:p-7 rounded-2xl border border-indigo-550/15 bg-indigo-50/10 hover:bg-indigo-50/20 transition-all duration-300 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-800">
                <Terminal className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-black text-indigo-900">
                  الطريقة الثانية: توليد ملف EXE وتنصيبه مستقل بالكامل
                </h3>
                <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">ملف تنفيذي متكامل لنظام تشغيل Windows 10 / 11</span>
              </div>
            </div>

            <p className="text-[11.5px] leading-relaxed text-slate-650">
              قمنا بإضافة إعدادات حزمة المطورين لبناء ملف تنفيذي مستقل <span className="font-mono bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded text-[10.5px]">.exe</span> يفتح المنصة في شاشة مستقلة، متصلة بقاعدة البيانات المحلية المشتركة، ويعمل بشكل نقي ومريح.
            </p>

            <div className="bg-white/85 p-4.5 rounded-xl border border-slate-150 space-y-3">
              <h4 className="text-[11px] font-extrabold text-indigo-900">📋 أوامر التوليد والتشغيل التلقائي:</h4>
              <p className="text-[10px] text-slate-500">انسخ الأمر التالي وحفّزه في واجهة الكوماند (CMD) لتحصل على ملف الـ .EXE فوراً:</p>
              
              <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[9.5px] border border-slate-800 overflow-x-auto relative group">
                <code className="whitespace-nowrap select-all">{packagerCommand}</code>
                <button
                  onClick={copyToClipboard}
                  className="absolute left-2 top-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="نسخ الأمر"
                >
                  {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              
              {copiedText && (
                <span className="text-[10px] text-emerald-600 font-bold block text-left">✓ تم نسخ الكود الجاهز لسطح المكتب الفوري!</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-500/10">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10.5px] text-amber-900 md:leading-relaxed leading-normal flex items-start gap-2.5 font-medium/60 shadow-inner">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-black mb-1">💡 هل ترغب بالتحويل محلياً؟</strong>
                يمكنك تصدير الكود كملف ZIP من قائمة إعدادات الاستوديو (في الأعلى)، وفك الضغط عنه على كمبيوترك، ثم تشغيل ملف السكربت الجاهز <strong className="text-emerald-700">تحويل_برنامج_إلى_EXE.bat</strong> الذي أضفناه لك ليقوم بتوليد ملف EXE بضغطة واحدة!
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 📖 Step by Step packing setup tutorial  */}
      <div className="p-6 md:p-7 rounded-2xl border border-slate-150 bg-slate-50 shadow-sm space-y-4">
        <h4 className="text-xs md:text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emerald-700" />
          خطوات إضافية لبناء نسخة مخصصة وتوزيعها على مدارس أخرى للعمل بملف تنصيب EXE:
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-2 text-[11px]">
          <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono">١</div>
            <strong className="block font-bold text-slate-800">تثبيت Node.js</strong>
            <p className="text-slate-550 leading-relaxed">قم بتحميل وتثبيت بيئة تشغيل <strong>Node.js</strong> من موقعها الرسمي لتشغيل الأوامر البرمجية على الويندوز.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono">٢</div>
            <strong className="block font-bold text-slate-800">توليد ملف EXE</strong>
            <p className="text-slate-550 leading-relaxed">افتح نافذة الأوامر CMD على كمبيوترك والصق الكود المنسوخ أعلاه، واضغط زر Enter لإنتاج البرنامج فوراً.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono">٣</div>
            <strong className="block font-bold text-slate-800">تثبيت الأيقونة والتشغيل</strong>
            <p className="text-slate-550 leading-relaxed">ابحث عن مجلد "DesktopApp" المتولد على حاسوبك، حيث ستجد بداخله ملف <strong>EXE</strong> مع شعارك الرسمي لفتحه مباشرة!</p>
          </div>
        </div>
      </div>

    </div>
  );
}
