export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screenDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  dateTimestamp: number;
  area: string; // พื้นที่ (เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้)
  gender: 'ชาย' | 'หญิง' | string;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  sbp: number; // SBP_mmHg ความดันตัวบน
  dbp: number; // DBP_mmHg ความดันตัวล่าง
  pulse: number; // ชีพจร_bpm
  bloodSugar: number; // น้ำตาล_mg_dL
  smoking: 'ไม่สูบ' | 'สูบ' | string;
  alcohol: 'ไม่ดื่ม' | 'ดื่ม' | string;
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string;
  diabetesScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  hypertensionScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  riskScore: number; // 0 - 7
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง';
  month: string; // 2026-01, 2026-02, 2026-03
}

export interface FilterState {
  area: string; // 'ทั้งหมด' or specific area
  gender: string; // 'ทั้งหมด' | 'ชาย' | 'หญิง'
  riskLevel: string; // 'ทั้งหมด' | 'ต่ำ' | 'ปานกลาง' | 'สูง'
  searchQuery: string;
}

export type ActiveTab = 'overview' | 'risk_trend' | 'behavior_insights' | 'records_table';
