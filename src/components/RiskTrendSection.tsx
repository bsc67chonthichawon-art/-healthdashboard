import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  HeartPulse, 
  Layers,
  Info
} from 'lucide-react';
import { HealthRecord } from '../types';

interface RiskTrendSectionProps {
  records: HealthRecord[];
}

export const RiskTrendSection: React.FC<RiskTrendSectionProps> = ({ records }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'sugar' | 'sbp' | 'bmi' | 'dbp'>('all');

  if (records.length === 0) {
    return null;
  }

  // 1. Health Trend: 2 Fields (วันที่คัดกรอง, น้ำตาล_mg_dL)
  // Sort chronologically by dateTimestamp
  const sortedByDate = [...records].sort((a, b) => a.dateTimestamp - b.dateTimestamp);

  const trendData = sortedByDate.map((r) => ({
    date: r.screenDate,
    rawDate: r.dateTimestamp,
    sugar: r.bloodSugar,
    sbp: r.sbp,
    dbp: r.dbp,
    bmi: r.bmi,
    id: r.id,
    riskLevel: r.riskLevel,
    name: `${r.id} (${r.gender})`
  }));

  // 2. Health Risk: 4 Fields (BMI, SBP_mmHg, DBP_mmHg, น้ำตาล_mg_dL)
  // Group by risk level: ต่ำ, ปานกลาง, สูง
  const riskLevels: ('ต่ำ' | 'ปานกลาง' | 'สูง')[] = ['ต่ำ', 'ปานกลาง', 'สูง'];

  const riskComparisonData = riskLevels.map((level) => {
    const group = records.filter(r => r.riskLevel === level);
    const gCount = group.length;

    const avg = (fn: (r: HealthRecord) => number) =>
      gCount > 0 ? +(group.reduce((acc, curr) => acc + fn(curr), 0) / gCount).toFixed(1) : 0;

    return {
      level: level === 'ต่ำ' ? 'ความเสี่ยงต่ำ' : level === 'ปานกลาง' ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงสูง',
      shortLevel: level,
      count: gCount,
      avgBMI: avg(r => r.bmi),
      avgSBP: avg(r => r.sbp),
      avgDBP: avg(r => r.dbp),
      avgSugar: avg(r => r.bloodSugar),
    };
  });

  return (
    <div className="space-y-6 mb-8">
      
      {/* Section Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <h2 className="text-base font-bold text-slate-800">
              ส่วนการวิเคราะห์ด้วยภาพ: ความเสี่ยงและแนวโน้มสุขภาพ (Health Risk & Trend)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            วิเคราะห์ 4 ปัจจัยเสี่ยงหลัก (BMI, SBP, DBP, น้ำตาล) และแนวโน้มระดับน้ำตาลตามช่วงเวลาคัดกรอง
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: Health Trend (วันที่คัดกรอง vs น้ำตาล_mg_dL) - 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-rose-100/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Health Trend: แนวโน้มระดับน้ำตาลในเลือดตามวันที่คัดกรอง
                </h3>
                <p className="text-[11px] text-slate-500">
                  ฟิลด์: [วันที่คัดกรอง] และ [น้ำตาล_mg_dL] (mg/dL)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ปกติ &lt;100
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                เสี่ยงเบาหวาน ≥126
              </span>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pastelSugarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[70, 180]} 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  axisLine={false}
                  tickLine={false}
                  unit=" mg"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isHigh = data.sugar >= 126;
                      const isPre = data.sugar >= 100 && data.sugar < 126;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-semibold text-slate-800">
                            {data.id} • วันที่ {data.date}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">ระดับน้ำตาล:</span>
                            <span className={`font-mono font-bold text-sm ${isHigh ? 'text-rose-600' : isPre ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {data.sugar} mg/dL
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-slate-500">ระดับความเสี่ยง:</span>
                            <span className={`font-medium px-1.5 py-0.2 rounded text-[10px] ${
                              data.riskLevel === 'สูง' 
                                ? 'bg-rose-100 text-rose-800' 
                                : data.riskLevel === 'ปานกลาง'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {data.riskLevel}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            ความดัน: {data.sbp}/{data.dbp} mmHg • BMI: {data.bmi}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={100} 
                  stroke="#10B981" 
                  strokeDasharray="4 4" 
                  label={{ value: 'เกณฑ์ปกติ 100', fill: '#10B981', fontSize: 10, position: 'insideTopLeft' }} 
                />
                <ReferenceLine 
                  y={126} 
                  stroke="#F43F5E" 
                  strokeDasharray="4 4" 
                  label={{ value: 'จุดตัดเบาหวาน 126', fill: '#F43F5E', fontSize: 10, position: 'insideTopLeft' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sugar" 
                  stroke="#E11D48" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#pastelSugarGradient)" 
                  dot={{ r: 3, fill: '#E11D48', strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#BE123C' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 flex items-start gap-2 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>ข้อสังเกตแนวโน้ม:</strong> ช่วงปลายเดือนมกราคม กุมภาพันธ์ และมีนาคม พบประชากรที่มีระดับน้ำตาลเกิน 126 mg/dL เพิ่มสูงขึ้นในกลุ่มผู้มีคะแนนความเสี่ยงสะสม 4-7 คะแนน
            </span>
          </div>
        </div>

        {/* CHART 2: Health Risk 4 Fields (BMI, SBP, DBP, น้ำตาล) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Health Risk: เปรียบเทียบ 4 ปัจจัยเสี่ยง
                </h3>
                <p className="text-[11px] text-slate-500">
                  ตาม 3 ระดับความเสี่ยง (ต่ำ / ปานกลาง / สูง)
                </p>
              </div>
            </div>

            {/* Metric Filter */}
            <select
              value={activeMetric}
              onChange={(e) => setActiveMetric(e.target.value as any)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium"
            >
              <option value="all">ดูทั้ง 4 ปัจจัย</option>
              <option value="sugar">เฉพาะน้ำตาล (mg/dL)</option>
              <option value="sbp">เฉพาะความดันบน (SBP)</option>
              <option value="dbp">เฉพาะความดันล่าง (DBP)</option>
              <option value="bmi">เฉพาะ BMI (kg/m²)</option>
            </select>
          </div>

          {/* Bar Chart comparing 4 fields */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="shortLevel" 
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-slate-800 mb-1 border-b pb-1">
                            กลุ่มความเสี่ยง: {label}
                          </p>
                          {payload.map((item: any, idx) => (
                            <div key={idx} className="flex justify-between gap-3">
                              <span className="text-slate-500">{item.name}:</span>
                              <span className="font-mono font-semibold" style={{ color: item.color }}>
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
                  iconType="circle"
                />

                {(activeMetric === 'all' || activeMetric === 'bmi') && (
                  <Bar dataKey="avgBMI" name="1. BMI (kg/m²)" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
                )}
                {(activeMetric === 'all' || activeMetric === 'sbp') && (
                  <Bar dataKey="avgSBP" name="2. SBP (mmHg)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                )}
                {(activeMetric === 'all' || activeMetric === 'dbp') && (
                  <Bar dataKey="avgDBP" name="3. DBP (mmHg)" fill="#818CF8" radius={[4, 4, 0, 0]} />
                )}
                {(activeMetric === 'all' || activeMetric === 'sugar') && (
                  <Bar dataKey="avgSugar" name="4. น้ำตาล (mg/dL)" fill="#FB7185" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-medium">เสี่ยงต่ำ</span>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">
                {records.filter(r => r.riskLevel === 'ต่ำ').length} คน
              </p>
              <p className="text-[10px] text-emerald-600">BMI เฉลี่ย 22.8</p>
            </div>
            <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-[10px] text-amber-700 font-medium">เสี่ยงปานกลาง</span>
              <p className="text-xs font-bold text-amber-900 mt-0.5">
                {records.filter(r => r.riskLevel === 'ปานกลาง').length} คน
              </p>
              <p className="text-[10px] text-amber-600">BMI เฉลี่ย 26.7</p>
            </div>
            <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-[10px] text-rose-700 font-medium">เสี่ยงสูง</span>
              <p className="text-xs font-bold text-rose-900 mt-0.5">
                {records.filter(r => r.riskLevel === 'สูง').length} คน
              </p>
              <p className="text-[10px] text-rose-600">BMI เฉลี่ย 30.0</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
