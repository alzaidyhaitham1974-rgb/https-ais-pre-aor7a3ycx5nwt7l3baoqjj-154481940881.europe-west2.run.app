/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum StudentType {
  STUDENT = 'طالب',
  TEACHER = 'مدرس',
  STAFF = 'موظف'
}

export enum SubjectKey {
  ISLAMIC = 'التربية الاسلامية',
  ARABIC = 'اللغة العربية',
  ENGLISH = 'اللغة الانكليزية',
  MATH = 'الرياضيات',
  PHYSICS = 'الفيزياء',
  CHEMISTRY = 'الكيمياء',
  BIOLOGY = 'الاحياء',
  BAATH_CRIMES = 'جرائم حزب البعث',
  COMPUTER = 'الحاسوب',
  ART = 'التربية الفنية',
  SPORTS = 'التربية الرياضية'
}

export interface SubjectGrades {
  m1t1?: number; // الشهر الاول الفصل الاول
  m2t1?: number; // الشهر الثاني الفصل الاول
  avg1?: number; // معدل الفصل الاول
  midyear?: number; // نصف السنة
  m1t2?: number; // الشهر الاول الفصل الثاني
  m2t2?: number; // الشهر الثاني الفصل الثاني
  avg2?: number; // معدل الفصل الثاني
  endeavor?: number; // السعي السنوي
  finalExam?: number; // الامتحان النهائي
  finalGrade?: number; // الدرجة النهائية
  decisionApplied?: number; // درجة القرار المضافة
  finalAfterDecision?: number; // الدرجة بعد القرار
  secondAttemptExam?: number; // درجة امتحان الدور الثاني
  secondAttemptGrade?: number; // درجة الدور الثاني الإجمالية
  result?: 'ناجح' | 'راسب' | 'مكمل' | 'مستمر'; // النتيجة في المادة
}

export interface Student {
  id: string;
  seq: number;
  name: string;
  className: 'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي';
  classSection: string; // الشعبة مثل أ، ب، ج
  grades: Record<string, SubjectGrades>; // Map of SubjectKey (string) -> SubjectGrades
  overallResult: 'ناجح' | 'راسب' | 'مكمل' | 'مستمر';
  failedSubjectsList: string[]; // قائمة بدروس الرسوب والاكمال
  
  // معلومات تفصيلية للبحث والبطاقة الشخصية
  dob: string; // التولد
  birthPlace: string; // محل الولادة
  failureYears: number; // سنوات الرسوب
  nationalId: string; // رقم البطاقة الوطنية
  nationalIdDate: string; // تاريخ اصدارها
  isOrphan: boolean; // هل الطالب يتيم
  hasDisease: boolean; // هل الطالب يعاني من مرض
  diseaseType?: string; // نوع المرض
  address: string; // عنوان السكن الحالي
  canStudyThisYear: boolean; // هل يحق له الدوام خلال العام الحالي
  cannotStudyReason?: string; // سبب عدم الحق بالدوام
  isGraduate?: boolean; // هل تم ترحيله للخريجين
}

export interface Teacher {
  id: string;
  seq: number;
  empNum: string; // الرقم الوظيفي
  name: string;
  specialty: string; // الاختصاص
  dob: string; // التولد
  jobTitle: 'مدرس' | 'مدير' | 'معاون' | string; // العنوان الوظيفي
  birthPlace: string; // محل الولادة
  gradDate: string; // تاريخ التخرج
  college: string; // الكلية او الجامعة
  gender: 'ذكر' | 'أنثى';
  motherName: string; // اسم الأم الثلاثي
  appointmentDate: string; // تاريخ التعيين
  appointmentRef: string; // رقم صادر التعيين
  currentSchoolDate: string; // تاريخ المباشرة بالمدرسة الحالية
  lastWorkplace: string; // اخر مكان عمل
  nationalId: string; // رقم البطاقة الوطنية
  nationalIdDate: string; // تاريخ إصدارها
  status: 'داوم فعلي' | 'منسب إلى المدرسة' | 'منسب من المدرسة' | 'مجاز مريض' | 'مجاز اعتيادي' | string; // حالة الدوام والتنسيب والإجازة
  phone: string;
  address: string;
  notes: string;
}

export interface Staff {
  id: string;
  seq: number;
  empNum: string; // الرقم الوظيفي
  name: string;
  qualification: string; // التحصيل الدراسي
  dob: string; // التولد
  jobTitle: string; // العنوان الوظيفي
  birthPlace: string; // محل الولادة
  gradDate: string; // تاريخ التخرج
  college: string; // المعهد الكلية او الجامعة
  gender: 'ذكر' | 'أنثى';
  motherName: string; // اسم الأم الثلاثي
  appointmentDate: string; // تاريخ التعيين
  appointmentRef: string; // رقم صادر التعيين
  currentSchoolDate: string; // تاريخ المباشرة بالمدرسة الحالية
  lastWorkplace: string; // اخر مكان عمل
  nationalId: string; // رقم البطاقة الوطنية
  nationalIdDate: string; // تاريخ إصدارها
  status: 'داوم فعلي' | 'منسب إلى المدرسة' | 'منسب من المدرسة' | 'مجاز' | string; // حالة الدوام والتنسيب
  phone: string;
  address: string;
  notes: string;
}

export interface SchedulePeriod {
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  class1: string; // المدرس - المادة - الصف والشعبة
  class2: string;
  class3: string;
  class4: string;
  class5: string;
  class6: string;
}

export interface ScheduleAllocation {
  id: string;
  teacherName: string;
  totalPeriods: number; // عدد الحصص التي يدرسها
  classesTaught: string[]; // الرابع العلمي، الخامس العلمي، السادس العلمي
  periodsPerSection: Record<string, number>; // عدد الدروس التي يقوم بتدريسها في كل شعبة
}

export interface OfficialLetter {
  id: string;
  type: 'انفكاك' | 'مباشرة' | 'استفسار' | 'طلب_اجازة' | 'تاييد_استمرار' | 'تاييد' | 'تاييد_درجات' | 'واقع_حال' | 'قبول_طالب' | 'مباشرة_الهيئة';
  letterNum: string;
  dateStr: string;
  recipient: string; // الجهة المعنون لها
  subject: string; // الغرض من الكتاب
  targetName: string; // اسم المدرس او الموظف او الطالب
  targetType: 'مدرس' | 'موظف' | 'طالب';
  body: string;
}

export interface AppSettings {
  schoolName: string;
  principalName: string;
  principalTitle: string;
  logoUrl: string; // Base64 or inline SVG styling info
  decisionLimit: 5 | 10; // درجات القرار 5 او 10
  allowedSubjects: Record<'الرابع العلمي' | 'الخامس العلمي' | 'السادس العلمي', string[]>;
  currentAcademicYear: string;
  previousAcademicYear: string;
}
