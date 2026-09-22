import React, { useState } from 'react';
import { 
  Users, 
  Scale, 
  Heart, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  BarChart2
} from 'lucide-react';
import { HealthRecord } from '../types';

interface KPICardsProps {
  records: HealthRecord[];
}

type ViewMode = 'all' | 'summary' | 'proportions';

export const KPICards: React.FC<KPICardsProps> = ({ records }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const count = records.length;
  if (count === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
        ไม่พบข้อมูลประชากรตามเงื่อนไขตัวกรอง กรุณาปรับเปลี่ยนตัวกรองใหม่
      </div>
    );
  }

  // Helper calculations
  const calcStats = (arr: number[]) => {
    if (arr.length === 0) return { mean: 0, min: 0, max: 0 };
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = +(sum / arr.length).toFixed(1);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { mean, min, max };
  };

  // 1. Population breakdown
  const maleCount = records.filter(r => r.gender === 'ชาย').length;
  const femaleCount = records.filter(r => r.gender === 'หญิง').length;
  const malePct = Math.round((maleCount / count) * 100);
  const femalePct = Math.round((femaleCount / count) * 100);

  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;
  const medRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;

  const lowRiskPct = Math.round((lowRiskCount / count) * 100);
  const medRiskPct = Math.round((medRiskCount / count) * 100);
  const highRiskPct = Math.round((highRiskCount / count) * 100);

  // 2. BMI
  const bmiValues = records.map(r => r.bmi);
  const bmiStats = calcStats(bmiValues);
  const bmiNormal = records.filter(r => r.bmi < 23).length; // เกณฑ์เอเชีย ปกติ < 23
  const bmiOverweight = records.filter(r => r.bmi >= 23 && r.bmi < 25).length; // ท้วม 23-24.9
  const bmiObese = records.filter(r => r.bmi >= 25).length; // อ้วน >= 25
  const bmiNormalPct = Math.round((bmiNormal / count) * 100);
  const bmiOverweightPct = Math.round((bmiOverweight / count) * 100);
  const bmiObesePct = Math.round((bmiObese / count) * 100);

  // 3. SBP
  const sbpValues = records.map(r => r.sbp);
  const sbpStats = calcStats(sbpValues);
  const sbpNormal = records.filter(r => r.sbp < 120).length; // ปกติ < 120
  const sbpPreHypertension = records.filter(r => r.sbp >= 120 && r.sbp < 140).length; // เฝ้าระวัง 120-139
  const sbpHigh = records.filter(r => r.sbp >= 140).length; // ความดันโลหิตสูง >= 140
  const sbpNormalPct = Math.round((sbpNormal / count) * 100);
  const sbpPrePct = Math.round((sbpPreHypertension / count) * 100);
  const sbpHighPct = Math.round((sbpHigh / count) * 100);

  // 4. Blood Sugar
  const sugarValues = records.map(r => r.bloodSugar);
  const sugarStats = calcStats(sugarValues);
  const sugarNormal = records.filter(r => r.bloodSugar < 100).length; // ปกติ < 100 mg/dL
  const sugarPreDiabetes = records.filter(r => r.bloodSugar >= 100 && r.bloodSugar <= 125).length; // เสี่ยง 100-125
  const sugarDiabetes = records.filter(r => r.bloodSugar >= 126).length; // เสี่ยงเบาหวาน >= 126
  const sugarNormalPct = Math.round((sugarNormal / count) * 100);
  const sugarPrePct = Math.round((sugarPreDiabetes / count) * 100);
  const sugarDiabetesPct = Math.round((sugarDiabetes / count) * 100);

  return (
    <div className="mb-8">
      {/* Section Header with View Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <h2 className="text-base font-bold text-slate-800">
              การสรุปข้อมูลสำคัญ (Health Overview & KPI Cards)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            สรุปข้อมูลสถิติสุขภาพ 4 ตัวชี้วัดหลัก: จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด-สูงสุด, สัดส่วน และร้อยละ
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto border border-slate-200/80">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            แสดงทั้งหมด
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'summary'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ค่าเฉลี่ย/ต่ำสุด/สูงสุด
          </button>
          <button
            onClick={() => setViewMode('proportions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'proportions'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            สัดส่วน & ร้อยละ
          </button>
        </div>
      </div>

      {/* 4 Health Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: จำนวนประชากรทั้งหมด */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700/80">
                1. จำนวนประชากร
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
                  {count}
                </span>
                <span className="text-sm font-medium text-slate-500">คน (ราย)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                กลุ่มประชากรที่ได้รับการคัดกรองสุขภาพ
              </p>
            </div>

            {/* Sub-summaries: Proportions & Percentages */}
            <div className="space-y-2 pt-3 border-t border-purple-50 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  ชาย: {maleCount} คน
                </span>
                <span className="font-semibold text-slate-700">{malePct}%</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  หญิง: {femaleCount} คน
                </span>
                <span className="font-semibold text-slate-700">{femalePct}%</span>
              </div>

              {/* Progress bar of gender */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                <div style={{ width: `${malePct}%` }} className="bg-blue-400 h-full" title={`ชาย ${malePct}%`}></div>
                <div style={{ width: `${femalePct}%` }} className="bg-pink-400 h-full" title={`หญิง ${femalePct}%`}></div>
              </div>

              {/* Risk distribution summary */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-700 font-medium">ต่ำ: {lowRiskPct}%</span>
                <span className="text-amber-700 font-medium">กลาง: {medRiskPct}%</span>
                <span className="text-rose-700 font-medium">สูง: {highRiskPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: BMI */}
        <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 opacity-60 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700/80">
                2. ดัชนีมวลกาย (BMI)
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
                  {bmiStats.mean}
                </span>
                <span className="text-sm font-medium text-slate-500">kg/m² (ค่าเฉลี่ย)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                เกณฑ์มาตรฐานคนเอเชีย: 18.5 - 22.9
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-teal-50 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">ค่าต่ำสุด - ค่าสูงสุด:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {bmiStats.min} - {bmiStats.max}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-emerald-700">ปกติ (&lt;23): {bmiNormal} คน</span>
                <span className="font-semibold text-emerald-800">{bmiNormalPct}%</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-rose-700">ภาวะอ้วน (≥25): {bmiObese} คน</span>
                <span className="font-semibold text-rose-800">{bmiObesePct}%</span>
              </div>

              {/* Stacked bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                <div style={{ width: `${bmiNormalPct}%` }} className="bg-emerald-400 h-full" title={`ปกติ ${bmiNormalPct}%`}></div>
                <div style={{ width: `${bmiOverweightPct}%` }} className="bg-amber-400 h-full" title={`ท้วม ${bmiOverweightPct}%`}></div>
                <div style={{ width: `${bmiObesePct}%` }} className="bg-rose-400 h-full" title={`อ้วน ${bmiObesePct}%`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: ความดันตัวบน (SBP_mmHg) */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 opacity-60 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700/80">
                3. ความดันตัวบน (SBP)
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
                  {sbpStats.mean}
                </span>
                <span className="text-sm font-medium text-slate-500">mmHg (ค่าเฉลี่ย)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                เกณฑ์ปกติ: &lt; 120 mmHg
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-sky-50 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">ค่าต่ำสุด - ค่าสูงสุด:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {sbpStats.min} - {sbpStats.max}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-emerald-700">ปกติ (&lt;120): {sbpNormal} คน</span>
                <span className="font-semibold text-emerald-800">{sbpNormalPct}%</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-rose-700">ความดันสูง (≥140): {sbpHigh} คน</span>
                <span className="font-semibold text-rose-800">{sbpHighPct}%</span>
              </div>

              {/* Stacked bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                <div style={{ width: `${sbpNormalPct}%` }} className="bg-emerald-400 h-full" title={`ปกติ ${sbpNormalPct}%`}></div>
                <div style={{ width: `${sbpPrePct}%` }} className="bg-amber-400 h-full" title={`เฝ้าระวัง ${sbpPrePct}%`}></div>
                <div style={{ width: `${sbpHighPct}%` }} className="bg-rose-400 h-full" title={`สูง ${sbpHighPct}%`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: ระดับน้ำตาล (น้ำตาล_mg_dL) */}
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 opacity-60 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700/80">
                4. ระดับน้ำตาลในเลือด
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
                  {sugarStats.mean}
                </span>
                <span className="text-sm font-medium text-slate-500">mg/dL (ค่าเฉลี่ย)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                เกณฑ์ปกติ: &lt; 100 mg/dL (งดน้ำและอาหาร)
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-rose-50 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">ค่าต่ำสุด - ค่าสูงสุด:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {sugarStats.min} - {sugarStats.max}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-emerald-700">ปกติ (&lt;100): {sugarNormal} คน</span>
                <span className="font-semibold text-emerald-800">{sugarNormalPct}%</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="text-rose-700">เสี่ยงเบาหวาน (≥126): {sugarDiabetes} คน</span>
                <span className="font-semibold text-rose-800">{sugarDiabetesPct}%</span>
              </div>

              {/* Stacked bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                <div style={{ width: `${sugarNormalPct}%` }} className="bg-emerald-400 h-full" title={`ปกติ ${sugarNormalPct}%`}></div>
                <div style={{ width: `${sugarPrePct}%` }} className="bg-amber-400 h-full" title={`กลุ่มเสี่ยง ${sugarPrePct}%`}></div>
                <div style={{ width: `${sugarDiabetesPct}%` }} className="bg-rose-400 h-full" title={`เบาหวาน ${sugarDiabetesPct}%`}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Expanded Statistical Comparison Table in Summary View */}
      {viewMode !== 'all' && (
        <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              ตารางสรุปตัวเลขสถิติเชิงปริมาณ (จำนวน, ค่าเฉลี่ย, Min, Max, สัดส่วน และร้อยละ)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">ตัวชี้วัดสุขภาพ</th>
                  <th className="py-2.5 px-3 font-semibold">จำนวนกลุ่มตัวอย่าง</th>
                  <th className="py-2.5 px-3 font-semibold">ค่าเฉลี่ย (Mean)</th>
                  <th className="py-2.5 px-3 font-semibold">ค่าต่ำสุด (Min)</th>
                  <th className="py-2.5 px-3 font-semibold">ค่าสูงสุด (Max)</th>
                  <th className="py-2.5 px-3 font-semibold">สัดส่วนกลุ่มปกติ</th>
                  <th className="py-2.5 px-3 font-semibold">สัดส่วนกลุ่มเสี่ยง / สูง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-purple-900">1. กลุ่มประชากร</td>
                  <td className="py-2.5 px-3 font-mono">{count} ราย</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3">-</td>
                  <td className="py-2.5 px-3 text-emerald-700">เสี่ยงต่ำ {lowRiskCount} ราย ({lowRiskPct}%)</td>
                  <td className="py-2.5 px-3 text-rose-700">เสี่ยงสูง {highRiskCount} ราย ({highRiskPct}%)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-teal-900">2. ดัชนีมวลกาย (BMI)</td>
                  <td className="py-2.5 px-3 font-mono">{count} ราย</td>
                  <td className="py-2.5 px-3 font-mono font-semibold">{bmiStats.mean} kg/m²</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">{bmiStats.min}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{bmiStats.max}</td>
                  <td className="py-2.5 px-3 text-emerald-700">{bmiNormal} ราย ({bmiNormalPct}%)</td>
                  <td className="py-2.5 px-3 text-rose-700">{bmiObese} ราย ({bmiObesePct}%)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-sky-900">3. ความดันตัวบน (SBP_mmHg)</td>
                  <td className="py-2.5 px-3 font-mono">{count} ราย</td>
                  <td className="py-2.5 px-3 font-mono font-semibold">{sbpStats.mean} mmHg</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">{sbpStats.min}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{sbpStats.max}</td>
                  <td className="py-2.5 px-3 text-emerald-700">{sbpNormal} ราย ({sbpNormalPct}%)</td>
                  <td className="py-2.5 px-3 text-rose-700">{sbpHigh} ราย ({sbpHighPct}%)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-rose-900">4. ระดับน้ำตาล (mg/dL)</td>
                  <td className="py-2.5 px-3 font-mono">{count} ราย</td>
                  <td className="py-2.5 px-3 font-mono font-semibold">{sugarStats.mean} mg/dL</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">{sugarStats.min}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{sugarStats.max}</td>
                  <td className="py-2.5 px-3 text-emerald-700">{sugarNormal} ราย ({sugarNormalPct}%)</td>
                  <td className="py-2.5 px-3 text-rose-700">{sugarDiabetes} ราย ({sugarDiabetesPct}%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
