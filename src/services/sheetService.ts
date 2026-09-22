import { HealthRecord } from '../types';
import { fallbackRecords } from '../data/fallbackData';

export const SHEET_ID = '1rr2wRRTBFIxnMItBuFFkgzGKo8Yekqf8hz7iup5K9UQ';
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
export const SHEET_VIEW_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseThaiDate(dateStr: string): { timestamp: number; formatted: string } {
  // e.g. 3/1/2026 or 14/2/2026 (day/month/year)
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-based
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return {
      timestamp: isNaN(d.getTime()) ? 0 : d.getTime(),
      formatted: dateStr
    };
  }
  return { timestamp: 0, formatted: dateStr };
}

export async function fetchHealthRecordsFromSheet(): Promise<{
  records: HealthRecord[];
  isLive: boolean;
  lastUpdated: string;
  errorMessage?: string;
}> {
  const now = new Date();
  const timeString = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' เวลา ' + now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' น.';

  try {
    const response = await fetch(SHEET_CSV_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv,text/plain,*/*'
      },
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`Google Sheets ตอบกลับสถานะ ${response.status}`);
    }

    const csvText = await response.text();
    if (!csvText || csvText.length < 50) {
      throw new Error('ข้อมูลจาก Google Sheet ว่างเปล่าหรือสั้นเกินไป');
    }

    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      throw new Error('ไม่พบข้อมูลประชากรใน Google Sheet');
    }

    // Header index mapping
    const headerRow = parseCSVLine(lines[0]);
    const colIndex: Record<string, number> = {};
    headerRow.forEach((col, idx) => {
      colIndex[col.trim()] = idx;
    });

    const parsedRecords: HealthRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length < 5) continue;

      const getVal = (colName: string, defaultVal: string = ''): string => {
        const idx = colIndex[colName];
        return idx !== undefined && row[idx] !== undefined ? row[idx] : defaultVal;
      };

      const id = getVal('รหัสบุคคล', `H${String(i).padStart(4, '0')}`);
      const screenDate = getVal('วันที่คัดกรอง', '');
      const { timestamp } = parseThaiDate(screenDate);
      const area = getVal('พื้นที่', 'ทั่วไป');
      const gender = (getVal('เพศ', 'ไม่ระบุ') === 'ชาย' ? 'ชาย' : 'หญิง');
      const age = parseFloat(getVal('อายุ', '0')) || 0;
      const heightCm = parseFloat(getVal('ส่วนสูง_cm', '0')) || 0;
      const weightKg = parseFloat(getVal('น้ำหนัก_kg', '0')) || 0;
      const bmi = parseFloat(getVal('BMI', '0')) || (heightCm > 0 ? +(weightKg / Math.pow(heightCm / 100, 2)).toFixed(1) : 0);
      const sbp = parseFloat(getVal('SBP_mmHg', '0')) || 0;
      const dbp = parseFloat(getVal('DBP_mmHg', '0')) || 0;
      const pulse = parseFloat(getVal('ชีพจร_bpm', '0')) || 0;
      const bloodSugar = parseFloat(getVal('น้ำตาล_mg_dL', '0')) || 0;
      const smoking = getVal('สูบบุหรี่', 'ไม่สูบ');
      const alcohol = getVal('ดื่มแอลกอฮอล์', 'ไม่ดื่ม');
      const exercise = getVal('การออกกำลังกาย', 'บางครั้ง');
      const diabetesScreen = getVal('เบาหวาน_คัดกรอง', 'ไม่มี');
      const hypertensionScreen = getVal('ความดันโลหิตสูง_คัดกรอง', 'ไม่มี');
      const riskScore = parseFloat(getVal('คะแนนความเสี่ยง', '0')) || 0;
      
      let riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' = 'ต่ำ';
      const rawRisk = getVal('ระดับความเสี่ยง', '');
      if (rawRisk.includes('สูง')) riskLevel = 'สูง';
      else if (rawRisk.includes('ปานกลาง')) riskLevel = 'ปานกลาง';
      else riskLevel = 'ต่ำ';

      const month = getVal('เดือน', '');

      parsedRecords.push({
        id,
        screenDate,
        dateTimestamp: timestamp,
        area,
        gender,
        age,
        heightCm,
        weightKg,
        bmi,
        sbp,
        dbp,
        pulse,
        bloodSugar,
        smoking,
        alcohol,
        exercise,
        diabetesScreen,
        hypertensionScreen,
        riskScore,
        riskLevel,
        month
      });
    }

    if (parsedRecords.length > 0) {
      return {
        records: parsedRecords,
        isLive: true,
        lastUpdated: timeString
      };
    } else {
      throw new Error('ประมวลผลข้อมูลไม่ได้');
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('Live Google Sheet fetch notice:', errorMsg, 'Using local synced data cache.');
    return {
      records: fallbackRecords,
      isLive: false,
      lastUpdated: timeString,
      errorMessage: errorMsg
    };
  }
}
