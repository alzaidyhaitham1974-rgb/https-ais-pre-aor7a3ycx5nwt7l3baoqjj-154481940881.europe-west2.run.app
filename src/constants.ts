/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings, Student, Teacher, Staff, SchedulePeriod, SubjectKey } from './types';
import { recalculateStudentGrades } from './utils';

export const DEFAULT_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-20 h-20 text-emerald-700">
  <defs>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5e0a3" />
      <stop offset="35%" stop-color="#d4af37" />
      <stop offset="70%" stop-color="#aa7c11" />
      <stop offset="100%" stop-color="#8a6508" />
    </linearGradient>
    <linearGradient id="blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c3254" />
      <stop offset="100%" stop-color="#051728" />
    </linearGradient>
    <linearGradient id="book-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d9e2ec" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#d9e2ec" />
    </linearGradient>
    <linearGradient id="cap-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d2f34" />
      <stop offset="100%" stop-color="#121315" />
    </linearGradient>
  </defs>

  <!-- External double golden ring and white separation layer -->
  <circle cx="50" cy="50" r="48" fill="none" stroke="url(#gold-grad)" stroke-width="1.2" />
  <circle cx="50" cy="50" r="46.8" fill="none" stroke="#ffffff" stroke-width="0.8" />
  <circle cx="50" cy="50" r="45.6" fill="none" stroke="url(#gold-grad)" stroke-width="0.6" />
  <circle cx="50" cy="50" r="45" fill="url(#blue-grad)" />

  <!-- Hidden text paths for curved labels -->
  <!-- Top curve (from left to right, curving upwards) -->
  <path id="top-text-curve" d="M 12.5,41 A 38.5,38.5 0 0,1 87.5,41" fill="none" stroke="none" />
  <!-- Bottom curve (from left to right, curving downwards) -->
  <path id="bottom-text-curve" d="M 17.5,60 A 35,35 0 0,0 82.5,60" fill="none" stroke="none" />

  <!-- School District / Ministry curved label at the top -->
  <text font-family="'Cairo', system-ui, -apple-system, sans-serif" font-weight="800">
    <textPath href="#top-text-curve" startOffset="50%" text-anchor="middle" fill="#ffffff" font-size="3.5" letter-spacing="0.1">
      المديرية العامة للتربية في ذي قار / قسم تربية الناصرية
    </textPath>
  </text>

  <!-- Central Gold Divider Ring -->
  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#gold-grad)" stroke-width="0.95" />

  <!-- 1. Open Book Graphics -->
  <!-- Book Cover Background border -->
  <path d="M 21,54.5 C 32,49.5 48,50.5 50,54.5 C 52,50.5 68,49.5 79,54.5 L 75,33.5 C 65,29.5 52,30.5 50,33.5 C 48,30.5 35,29.5 25,33.5 Z" fill="#8a6508" opacity="0.35" />
  
  <!-- Left Side Page Core Layers -->
  <path d="M 23,50.5 C 32,45.5 47,47.5 50,50.5 L 50,32.5 C 47,29.5 32,27.5 23,32.5 Z" fill="url(#book-shadow)" stroke="#c5a85c" stroke-width="0.3" />
  <path d="M 24,51.5 C 33,46.5 48,48.5 50,51.5 L 50,33.5 C 48,30.5 33,28.5 24,33.5 Z" fill="#ffffff" />
  
  <!-- Right Side Page Core Layers -->
  <path d="M 77,50.5 C 68,45.5 53,47.5 50,50.5 L 50,32.5 C 53,29.5 68,27.5 77,32.5 Z" fill="url(#book-shadow)" stroke="#c5a85c" stroke-width="0.3" />
  <path d="M 76,51.5 C 67,46.5 52,48.5 50,51.5 L 50,33.5 C 52,30.5 67,28.5 76,33.5 Z" fill="#ffffff" />

  <!-- Book Spine Center Divider -->
  <line x1="50" y1="32.5" x2="50" y2="51.5" stroke="#aa7c11" stroke-width="0.45" />

  <!-- 2. Academic Graduation Cap -->
  <!-- Cap Stand/Base -->
  <path d="M 43,26 L 43,29.5 C 43,32 57,32 57,29.5 L 57,26 Z" fill="#1b1c1e" stroke="url(#gold-grad)" stroke-width="0.35" />
  <path d="M 44,29.5 C 44,31 56,31 56,29.5" fill="none" stroke="#ffffff" stroke-width="0.3" opacity="0.5" />

  <!-- Diamond Top Cap Board -->
  <polygon points="50,20.5 68,26 50,31.5 32,26" fill="url(#cap-grad)" stroke="url(#gold-grad)" stroke-width="0.45" />

  <!-- Center Cap Button -->
  <circle cx="50" cy="25.8" r="0.8" fill="url(#gold-grad)" />
  
  <!-- Hanging Golden Tassel -->
  <path d="M 50,25.8 C 44.5,26.5 38.5,29.5 38.5,33" fill="none" stroke="url(#gold-grad)" stroke-width="0.45" stroke-linecap="round" />
  <polygon points="38.5,33 37.5,37 39.5,37" fill="url(#gold-grad)" />

  <!-- Horizontal Gold Divider Line -->
  <line x1="16" y1="56" x2="84" y2="56" stroke="url(#gold-grad)" stroke-width="1.2" />

  <!-- White Calligraphy Banner in Middle-Bottom for "الإعدادية المركزية للبنين" -->
  <path d="M 12.5,56 C 24,56 76,56 87.5,56 C 89,61 87,69 80,73.5 C 65,77.5 35,77.5 20,73.5 C 13,69 11,61 12.5,56 Z" fill="#ffffff" stroke="url(#gold-grad)" stroke-width="1.05" />
  <path d="M 14.5,58 C 25,58 75,58 85.5,58 C 86.8,62 84.8,67.5 78.5,71.5 C 64.5,75.5 35.5,75.5 21.5,71.5 C 15.2,67.5 13.2,62 14.5,58 Z" fill="none" stroke="#16385a" stroke-width="0.35" stroke-dasharray="0.6,0.6" />

  <!-- Beautiful precise text for the school calligraphy -->
  <text x="50" y="67" font-family="'Cairo', 'Tajawal', 'Traditional Arabic', sans-serif" font-weight="900" font-size="7.5" text-anchor="middle" fill="#0f3458" letter-spacing="0.1">
    الإعدادية المركزية للبنين
  </text>

  <!-- Curving Bottom Text Ribbon: "تأسست سنة 1970" -->
  <text font-family="'Cairo', system-ui, sans-serif" font-weight="700">
    <textPath href="#bottom-text-curve" startOffset="50%" text-anchor="middle" fill="#ffffff" font-size="3.8" letter-spacing="0.05">
      تأسست سنة 1970
    </textPath>
  </text>
</svg>
`;

export const INITIAL_SETTINGS: AppSettings = {
  schoolName: 'الإعدادية المركزية للبنين',
  principalName: 'أ. د. جاسم محمد ذياب السعيدي',
  principalTitle: 'مدير الإعدادية',
  logoUrl: DEFAULT_LOGO_SVG,
  decisionLimit: 5,
  currentAcademicYear: '2026-2027',
  previousAcademicYear: '2025-2026',
  allowedSubjects: {
    'الرابع العلمي': [
      SubjectKey.ISLAMIC,
      SubjectKey.ARABIC,
      SubjectKey.ENGLISH,
      SubjectKey.MATH,
      SubjectKey.PHYSICS,
      SubjectKey.CHEMISTRY,
      SubjectKey.BIOLOGY,
      SubjectKey.BAATH_CRIMES,
      SubjectKey.COMPUTER,
      SubjectKey.ART,
      SubjectKey.SPORTS
    ],
    'الخامس العلمي': [
      SubjectKey.ISLAMIC,
      SubjectKey.ARABIC,
      SubjectKey.ENGLISH,
      SubjectKey.MATH,
      SubjectKey.PHYSICS,
      SubjectKey.CHEMISTRY,
      SubjectKey.BIOLOGY,
      // Removed BAATH_CRIMES
      SubjectKey.COMPUTER,
      SubjectKey.ART,
      SubjectKey.SPORTS
    ],
    'السادس العلمي': [
      SubjectKey.ISLAMIC,
      SubjectKey.ARABIC,
      SubjectKey.ENGLISH,
      SubjectKey.MATH,
      SubjectKey.PHYSICS,
      SubjectKey.CHEMISTRY,
      SubjectKey.BIOLOGY,
      // Removed BAATH_CRIMES & COMPUTER
      SubjectKey.ART,
      SubjectKey.SPORTS
    ]
  }
};

const firstNames = ['حسين', 'جعفر', 'زيد', 'عبد الله', 'محمد', 'علي', 'أحمد', 'كرار', 'مصطفى', 'مرتضى', 'عباس', 'سجاد', 'حسن', 'يوسف', 'مهدي', 'طه', 'عمر', 'إبراهيم', 'سيف', 'أمير', 'حيدر', 'منتظر', 'رضا', 'ضياء', 'هيثم', 'صالح', 'جاسم', 'فلاح', 'عادل', 'ماجد'];
const middleNames = ['علي', 'جاسم', 'حيدر', 'معتز', 'طه', 'حسين', 'كاظم', 'صادق', 'سلمان', 'عبد الرضا', 'جبار', 'كريم', 'رياض', 'صالح', 'محسن', 'كامل', 'خلف', 'رحيم', 'برزان', 'ماجد', 'شاكر', 'هادي', 'سعيد', 'ضياء', 'جواد'];
const familyNames = ['الخفاجي', 'الأسدي', 'العبيدي', 'البياتي', 'الموسوي', 'الناصري', 'الجابري', 'السعدي', 'التميمي', 'العامري', 'الياسري', 'الزهيري', 'البهادلي', 'الركابي', 'الدراجي', 'الطائي', 'البديري', 'الحسناوي', 'العقابي', 'الحمداني'];

const classes = ['الرابع العلمي', 'الخامس العلمي', 'السادس العلمي'] as const;
const sections = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

const initialFour: Student[] = [
  {
    id: 's-1',
    seq: 1,
    name: 'حسين علي جاسم الخفاجي',
    className: 'الرابع العلمي',
    classSection: 'أ',
    dob: '2010-04-12',
    birthPlace: 'ذي قار / الناصرية',
    failureYears: 0,
    nationalId: '100234857642',
    nationalIdDate: '2021-08-15',
    isOrphan: false,
    hasDisease: false,
    address: 'الناصرية - حي الصالحية',
    canStudyThisYear: true,
    grades: {
      [SubjectKey.ISLAMIC]: { m1t1: 45, m2t1: 49, midyear: 48, m1t2: 44, m2t2: 48, finalExam: 48 },
      [SubjectKey.ARABIC]: { m1t1: 48, m2t1: 46, midyear: 52, m1t2: 45, m2t2: 49, finalExam: 47 },
      [SubjectKey.ENGLISH]: { m1t1: 40, m2t1: 42, midyear: 45, m1t2: 41, m2t2: 43, finalExam: 45 },
      [SubjectKey.MATH]: { m1t1: 49, m2t1: 49, midyear: 49, m1t2: 49, m2t2: 49, finalExam: 49 }, // candidates for decision 49 -> 50
      [SubjectKey.PHYSICS]: { m1t1: 85, m2t1: 89, midyear: 90, m1t2: 88, m2t2: 92, finalExam: 91 },
      [SubjectKey.CHEMISTRY]: { m1t1: 72, m2t1: 75, midyear: 70, m1t2: 74, m2t2: 78, finalExam: 76 },
      [SubjectKey.BIOLOGY]: { m1t1: 65, m2t1: 68, midyear: 62, m1t2: 66, m2t2: 70, finalExam: 67 },
      [SubjectKey.BAATH_CRIMES]: { m1t1: 95, m2t1: 98, midyear: 100, m1t2: 94, m2t2: 100, finalExam: 99 },
      [SubjectKey.COMPUTER]: { m1t1: 88, m2t1: 91, midyear: 89, m1t2: 90, m2t2: 92, finalExam: 90 },
      [SubjectKey.ART]: { m1t1: 95, m2t1: 95, midyear: 95, m1t2: 95, m2t2: 95, finalExam: 95 },
      [SubjectKey.SPORTS]: { m1t1: 98, m2t1: 98, midyear: 98, m1t2: 98, m2t2: 98, finalExam: 98 },
    },
    overallResult: 'مستمر',
    failedSubjectsList: []
  },
  {
    id: 's-2',
    seq: 2,
    name: 'جعفر صادق حيدر الأسدي',
    className: 'الخامس العلمي',
    classSection: 'ب',
    dob: '2009-11-22',
    birthPlace: 'ذي قار / الشطرة',
    failureYears: 0,
    nationalId: '100458372651',
    nationalIdDate: '2022-03-05',
    isOrphan: false,
    hasDisease: false,
    address: 'الناصرية - حي السراي',
    canStudyThisYear: true,
    grades: {
      [SubjectKey.ISLAMIC]: { m1t1: 92, m2t1: 95, midyear: 90, m1t2: 91, m2t2: 96, finalExam: 94 },
      [SubjectKey.ARABIC]: { m1t1: 82, m2t1: 85, midyear: 80, m1t2: 84, m2t2: 89, finalExam: 87 },
      [SubjectKey.ENGLISH]: { m1t1: 75, m2t1: 78, midyear: 72, m1t2: 77, m2t2: 80, finalExam: 79 },
      [SubjectKey.MATH]: { m1t1: 68, m2t1: 72, midyear: 65, m1t2: 70, m2t2: 75, finalExam: 73 },
      [SubjectKey.PHYSICS]: { m1t1: 60, m2t1: 64, midyear: 58, m1t2: 62, m2t2: 67, finalExam: 65 },
      [SubjectKey.CHEMISTRY]: { m1t1: 45, m2t1: 45, midyear: 45, m1t2: 45, m2t2: 45, finalExam: 45 }, // candidate for decision
      [SubjectKey.BIOLOGY]: { m1t1: 49, m2t1: 49, midyear: 49, m1t2: 49, m2t2: 49, finalExam: 49 }, // candidate for decision
      [SubjectKey.COMPUTER]: { m1t1: 85, m2t1: 88, midyear: 85, m1t2: 87, m2t2: 90, finalExam: 88 },
      [SubjectKey.ART]: { m1t1: 90, m2t1: 90, midyear: 90, m1t2: 90, m2t2: 90, finalExam: 90 },
      [SubjectKey.SPORTS]: { m1t1: 95, m2t1: 95, midyear: 95, m1t2: 95, m2t2: 95, finalExam: 95 }
    },
    overallResult: 'مستمر',
    failedSubjectsList: []
  },
  {
    id: 's-3',
    seq: 3,
    name: 'زيد معتز رياض العبيدي',
    className: 'السادس العلمي',
    classSection: 'أ',
    dob: '2008-01-30',
    birthPlace: 'بغداد / الرصافة',
    failureYears: 1,
    nationalId: '100142859384',
    nationalIdDate: '2020-11-10',
    isOrphan: true,
    hasDisease: false,
    address: 'الناصرية - حي الإسكان',
    canStudyThisYear: true,
    grades: {
      [SubjectKey.ISLAMIC]: { m1t1: 95, m2t1: 98, midyear: 96, m1t2: 97, m2t2: 99, finalExam: 98 },
      [SubjectKey.ARABIC]: { m1t1: 90, m2t1: 93, midyear: 91, m1t2: 92, m2t2: 94, finalExam: 93 },
      [SubjectKey.ENGLISH]: { m1t1: 88, m2t1: 90, midyear: 89, m1t2: 91, m2t2: 93, finalExam: 92 },
      [SubjectKey.MATH]: { m1t1: 96, m2t1: 99, midyear: 95, m1t2: 98, m2t2: 100, finalExam: 99 },
      [SubjectKey.PHYSICS]: { m1t1: 94, m2t1: 97, midyear: 93, m1t2: 95, m2t2: 98, finalExam: 96 },
      [SubjectKey.CHEMISTRY]: { m1t1: 92, m2t1: 95, midyear: 91, m1t2: 94, m2t2: 96, finalExam: 95 },
      [SubjectKey.BIOLOGY]: { m1t1: 90, m2t1: 93, midyear: 90, m1t2: 92, m2t2: 94, finalExam: 93 },
      [SubjectKey.ART]: { m1t1: 95, m2t1: 95, midyear: 95, m1t2: 95, m2t2: 95, finalExam: 95 },
      [SubjectKey.SPORTS]: { m1t1: 98, m2t1: 98, midyear: 98, m1t2: 98, m2t2: 98, finalExam: 98 }
    },
    overallResult: 'مستمر',
    failedSubjectsList: []
  },
  {
    id: 's-4',
    seq: 4,
    name: 'عبد الله طه عثمان البياتي',
    className: 'السادس العلمي',
    classSection: 'ج',
    dob: '2007-06-15',
    birthPlace: 'صلاح الدين / تكريت',
    failureYears: 2,
    nationalId: '100857492134',
    nationalIdDate: '2019-05-18',
    isOrphan: false,
    hasDisease: true,
    diseaseType: 'ربو شعبي خفيف',
    address: 'الناصرية - حي أريدو',
    canStudyThisYear: false,
    cannotStudyReason: 'العمر لا يسمح بالبقاء في الدراسة الصباحية',
    grades: {
      [SubjectKey.ISLAMIC]: { m1t1: 52, m2t1: 55, midyear: 51, m1t2: 54, m2t2: 58, finalExam: 55 },
      [SubjectKey.ARABIC]: { m1t1: 30, m2t1: 35, midyear: 32, m1t2: 34, m2t2: 38, finalExam: 35 }, // failed
      [SubjectKey.ENGLISH]: { m1t1: 32, m2t1: 38, midyear: 35, m1t2: 33, m2t2: 40, finalExam: 36 }, // failed
      [SubjectKey.MATH]: { m1t1: 42, m2t1: 45, midyear: 40, m1t2: 41, m2t2: 44, finalExam: 43 }, // failed
      [SubjectKey.PHYSICS]: { m1t1: 28, m2t1: 32, midyear: 30, m1t2: 31, m2t2: 34, finalExam: 32 }, // failed
      [SubjectKey.CHEMISTRY]: { m1t1: 45, m2t1: 48, midyear: 46, m1t2: 47, m2t2: 50, finalExam: 48 }, // failed
      [SubjectKey.BIOLOGY]: { m1t1: 52, m2t1: 55, midyear: 53, m1t2: 54, m2t2: 56, finalExam: 55 },
      [SubjectKey.ART]: { m1t1: 80, m2t1: 80, midyear: 80, m1t2: 80, m2t2: 80, finalExam: 80 },
      [SubjectKey.SPORTS]: { m1t1: 85, m2t1: 85, midyear: 85, m1t2: 85, m2t2: 85, finalExam: 85 }
    },
    overallResult: 'مستمر',
    failedSubjectsList: []
  }
];

const generateSampleStudents = (): Student[] => {
  const result: Student[] = [];

  initialFour.forEach(s => {
    const activeSubs = INITIAL_SETTINGS.allowedSubjects[s.className];
    result.push(recalculateStudentGrades(s, INITIAL_SETTINGS.decisionLimit, activeSubs));
  });

  for (let i = 5; i <= 1800; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const mName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const mName2 = middleNames[Math.floor(Math.random() * middleNames.length)];
    const famName = familyNames[Math.floor(Math.random() * familyNames.length)];
    const name = `${fName} ${mName} ${mName2} ${famName}`;

    const currentClass = classes[Math.floor(Math.random() * classes.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    const activeSubs = INITIAL_SETTINGS.allowedSubjects[currentClass];

    const grades: Record<string, any> = {};
    activeSubs.forEach(sub => {
      const coin = Math.random();
      let m1t1, m2t1, midyear, m1t2, m2t2, finalExam;
      
      if (coin < 0.70) {
        m1t1 = Math.floor(62 + Math.random() * 34);
        m2t1 = Math.floor(62 + Math.random() * 34);
        midyear = Math.floor(61 + Math.random() * 35);
        m1t2 = Math.floor(62 + Math.random() * 34);
        m2t2 = Math.floor(62 + Math.random() * 34);
        finalExam = Math.floor(61 + Math.random() * 35);
      } else if (coin < 0.88) {
        const target = Math.floor(45 + Math.random() * 5); // 45, 46, 47, 48, 49
        m1t1 = target - 2 + Math.floor(Math.random() * 5);
        m2t1 = target - 2 + Math.floor(Math.random() * 5);
        midyear = target;
        m1t2 = target - 2 + Math.floor(Math.random() * 5);
        m2t2 = target - 2 + Math.floor(Math.random() * 5);
        finalExam = target;
      } else {
        m1t1 = Math.floor(25 + Math.random() * 20);
        m2t1 = Math.floor(25 + Math.random() * 20);
        midyear = Math.floor(25 + Math.random() * 20);
        m1t2 = Math.floor(25 + Math.random() * 20);
        m2t2 = Math.floor(25 + Math.random() * 20);
        finalExam = Math.floor(25 + Math.random() * 20);
      }

      grades[sub] = { m1t1, m2t1, midyear, m1t2, m2t2, finalExam };
    });

    const sObj: Student = {
      id: `s-${i}`,
      seq: i,
      name,
      className: currentClass,
      classSection: section,
      dob: `20${Math.floor(7 + Math.random() * 4)}-0${Math.floor(1 + Math.random() * 9)}-${Math.floor(10 + Math.random() * 18)}`,
      birthPlace: 'ذي قار / الناصرية',
      failureYears: Math.random() < 0.08 ? 1 : 0,
      nationalId: `100${Math.floor(10000000 + Math.random() * 90000000)}`,
      nationalIdDate: '2022-05-10',
      isOrphan: Math.random() < 0.04,
      hasDisease: Math.random() < 0.02,
      address: 'الناصرية - حي الصالحية',
      canStudyThisYear: true,
      grades,
      overallResult: 'مستمر',
      failedSubjectsList: []
    };

    result.push(recalculateStudentGrades(sObj, INITIAL_SETTINGS.decisionLimit, activeSubs));
  }

  return result;
};

export const SAMPLE_STUDENTS: Student[] = generateSampleStudents();

export const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    seq: 1,
    empNum: 'T1001458',
    name: 'حامد عبد الرزاق الموسوي',
    specialty: 'الرياضيات',
    dob: '1976-05-18',
    jobTitle: 'مدرس',
    birthPlace: 'ذي قار / الناصرية',
    gradDate: '1998-07-01',
    college: 'جامعة البصرة / كلية التربية',
    gender: 'ذكر',
    motherName: 'فاطمة محمد علي',
    appointmentDate: '2000-10-15',
    appointmentRef: 'م.ت/٣٤٨٢',
    currentSchoolDate: '2008-09-01',
    lastWorkplace: 'ثانوية المتميزين للبنين',
    nationalId: '197684937265',
    nationalIdDate: '2018-04-12',
    status: 'داوم فعلي',
    phone: '07705544332',
    address: 'الناصرية - حي سومر',
    notes: 'مدرس قدير ومتميز في تدريس مجاميع السادس العلمي'
  },
  {
    id: 't-2',
    seq: 2,
    empNum: 'T1002958',
    name: 'صالح مهدي عبيد الناصري',
    specialty: 'الفيزياء',
    dob: '1981-09-12',
    jobTitle: 'معاون',
    birthPlace: 'ذي قار / الشطرة',
    gradDate: '2003-06-25',
    college: 'جامعة بغداد / كلية التربية ابن الهيثم',
    gender: 'ذكر',
    motherName: 'مريم حسن صالح',
    appointmentDate: '2005-11-20',
    appointmentRef: 'م.ت/١١٩٨',
    currentSchoolDate: '2012-10-01',
    lastWorkplace: 'إعدادية ذي قار للبنين',
    nationalId: '198158372654',
    nationalIdDate: '2019-02-20',
    status: 'داوم فعلي',
    phone: '07802211993',
    address: 'الناصرية - حي أريدو',
    notes: 'معاون شؤون الطلاب، بالاضافة لتدريس حصص الفيزياء للصف الخامس'
  },
  {
    id: 't-3',
    seq: 3,
    empNum: 'T1003482',
    name: 'سجاد كريم جبار الجابري',
    specialty: 'اللغة الانكليزية',
    dob: '1988-02-14',
    jobTitle: 'مدرس',
    birthPlace: 'النجف الأشرف',
    gradDate: '2010-06-30',
    college: 'جامعة الكوفة / كلية التربية',
    gender: 'ذكر',
    motherName: 'زينب جواد كاظم',
    appointmentDate: '2011-12-05',
    appointmentRef: 'م.ت/٨٩٣٤',
    currentSchoolDate: '2020-09-15',
    lastWorkplace: 'متوسطة النصر للبنين',
    nationalId: '198844857643',
    nationalIdDate: '2021-05-12',
    status: 'منسب إلى المدرسة',
    phone: '07503344221',
    address: 'الناصرية - حي التضحية',
    notes: 'منسب من ملاك ثانوية الكرار للبنين بموجب كتاب مديرية ذي قار'
  }
];

export const SAMPLE_STAFF: Staff[] = [
  {
    id: 'st-1',
    seq: 1,
    empNum: 'S2001485',
    name: 'ماهر ناصر حربي السعدي',
    qualification: 'دبلوم فني',
    dob: '1983-11-05',
    jobTitle: 'كاتب حسابات',
    birthPlace: 'ذي قار / الناصرية',
    gradDate: '2004-06-20',
    college: 'المعهد الفني الناصرية',
    gender: 'ذكر',
    motherName: 'حليمة كزار كاطع',
    appointmentDate: '2006-03-12',
    appointmentRef: 'م.ت/٢٠٣٩',
    currentSchoolDate: '2010-09-01',
    lastWorkplace: 'قسم الحسابات / تربية الناصرية',
    nationalId: '198358473629',
    nationalIdDate: '2017-10-18',
    status: 'داوم فعلي',
    phone: '07718899221',
    address: 'الناصرية - حي الشهداء',
    notes: 'مسؤول الشؤون المالية والرواتب'
  }
];

export const INITIAL_SCHEDULE: SchedulePeriod[] = [
  { day: 'الأحد', class1: 'الرياضيات - حامد عبد الرزاق - رابع أ', class2: 'الفيزياء - صالح مهدي - خامس ب', class3: 'الانكليزية - سجاد كريم - سادس أ', class4: 'الاحياء - ميزر مجيد - رابع أ', class5: 'الكيمياء - ثامر كامل - خامس ب', class6: 'الرياضيات - حامد عبد الرزاق - سادس أ' },
  { day: 'الإثنين', class1: 'الانكليزية - سجاد كريم - رابع أ', class2: 'الرياضيات - حامد عبد الرزاق - خامس ب', class3: 'الاحياء - ميزر مجيد - سادس أ', class4: 'الفيزياء - صالح مهدي - رابع أ', class5: 'الاسلامية - عبد الرحمن كزار - خامس ب', class6: 'العربية - عباس فرحان - سادس أ' },
  { day: 'الثلاثاء', class1: 'الفيزياء - صالح مهدي - رابع أ', class2: 'الانكليزية - سجاد كريم - خامس ب', class3: 'الكيمياء - ثامر كامل - سادس أ', class4: 'الرياضيات - حامد عبد الرزاق - رابع أ', class5: 'الحاسوب - مؤيد حسن - خامس ب', class6: 'الاحياء - ميزر مجيد - سادس أ' },
  { day: 'الأربعاء', class1: 'الكيمياء - ثامر كامل - رابع أ', class2: 'العربية - عباس فرحان - خامس ب', class3: 'الفيزياء - صالح مهدي - سادس أ', class4: 'الانكليزية - سجاد كريم - رابع أ', class5: 'الرياضيات - حامد عبد الرزاق - خامس ب', class6: 'الاسلامية - عبد الرحمن كزار - سادس أ' },
  { day: 'الخميس', class1: 'الحاسوب - مؤيد حسن - رابع أ', class2: 'الاحياء - mizer majeed - خامس ب', class3: 'العربية - عباس فرحان - سادس أ', class4: 'الفنية - علي جابر - رابع أ', class5: 'الرياضية - حيدر سعد - خامس ب', class6: 'الانكليزية - سجاد كريم - سادس أ' }
];

export const INITIAL_ALLOCATIONS = [
  { id: 'all-1', teacherName: 'حامد عبد الرزاق الموسوي', totalPeriods: 18, classesTaught: ['الرابع العلمي', 'الخامس العلمي', 'السادس العلمي'], periodsPerSection: { 'أ': 6, 'ب': 6, 'ج': 6 } },
  { id: 'all-2', teacherName: 'صالح مهدي عبيد الناصري', totalPeriods: 12, classesTaught: ['الرابع العلمي', 'الخامس العلمي'], periodsPerSection: { 'أ': 4, 'ب': 4, 'ج': 4 } },
  { id: 'all-3', teacherName: 'سجاد كريم جبار الجابري', totalPeriods: 15, classesTaught: ['الرابع العلمي', 'الخامس العلمي', 'السادس العلمي'], periodsPerSection: { 'أ': 5, 'ب': 5, 'ج': 5 } }
];
