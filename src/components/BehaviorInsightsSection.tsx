import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell,
  Legend,
  PieChart,
  Pie
} from 'recharts';
import { 
  Cigarette, 
  Wine, 
  Dumbbell, 
  Droplets, 
  MapPin, 
  Calendar, 
  Layers,
  Sparkles,
  HeartCrack
} from 'lucide-react';
import { HealthRecord } from '../types';

interface BehaviorInsightsProps {
  records: HealthRecord[];
}

export const BehaviorInsightsSection: React.FC<BehaviorInsightsProps> = ({ records }) => {
  const [insightTab, setInsightTab] = useState<'behavior' | 'age_area' | 'correlation'>('behavior');

  if (records.length === 0) return null;

  // 1. Health Behavior 4 fields analysis (สูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย, น้ำตาล_mg_dL)
  // Smoking vs Sugar
  const smokingYes = records.filter(r => r.smoking === 'สูบ');
  const smokingNo = records.filter(r => r.smoking === 'ไม่สูบ');
  const avgSugarSmokeYes = smokingYes.length ? +(smokingYes.reduce((s, r) => s + r.bloodSugar, 0) / smokingYes.length).toFixed(1) : 0;
  const avgSugarSmokeNo = smokingNo.length ? +(smokingNo.reduce((s, r) => s + r.bloodSugar, 0) / smokingNo.length).toFixed(1) : 0;

  // Alcohol vs Sugar
  const alcYes = records.filter(r => r.alcohol === 'ดื่ม');
  const alcNo = records.filter(r => r.alcohol === 'ไม่ดื่ม');
  const avgSugarAlcYes = alcYes.length ? +(alcYes.reduce((s, r) => s + r.bloodSugar, 0) / alcYes.length).toFixed(1) : 0;
  const avgSugarAlcNo = alcNo.length ? +(alcNo.reduce((s, r) => s + r.bloodSugar, 0) / alcNo.length).toFixed(1) : 0;

  // Exercise vs Sugar
  const exRegular = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const exSometimes = records.filter(r => r.exercise === 'บางครั้ง');
  const exNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');
  const avgSugarExReg = exRegular.length ? +(exRegular.reduce((s, r) => s + r.bloodSugar, 0) / exRegular.length).toFixed(1) : 0;
  const avgSugarExSome = exSometimes.length ? +(exSometimes.reduce((s, r) => s + r.bloodSugar, 0) / exSometimes.length).toFixed(1) : 0;
  const avgSugarExNone = exNone.length ? +(exNone.reduce((s, r) => s + r.bloodSugar, 0) / exNone.length).toFixed(1) : 0;

  const behaviorData = [
    {
      category: '1. บุหรี่: ไม่สูบ',
      avgSugar: avgSugarAlcNo ? avgSugarSmokeNo : 0,
      count: smokingNo.length,
      fill: '#A7F3D0',
      label: 'ไม่สูบบุหรี่'
    },
    {
      category: '1. บุหรี่: สูบ',
      avgSugar: avgSugarSmokeYes,
      count: smokingYes.length,
      fill: '#FCA5A5',
      label: 'สูบบุหรี่'
    },
    {
      category: '2. สุรา: ไม่ดื่ม',
      avgSugar: avgSugarAlcNo,
      count: alcNo.length,
      fill: '#99F6E4',
      label: 'ไม่ดื่มแอลกอฮอล์'
    },
    {
      category: '2. สุรา: ดื่ม',
      avgSugar: avgSugarAlcYes,
      count: alcYes.length,
      fill: '#FDBA74',
      label: 'ดื่มแอลกอฮอล์'
    },
    {
      category: '3. กิจกรรม: สม่ำเสมอ',
      avgSugar: avgSugarExReg,
      count: exRegular.length,
      fill: '#6EE7B7',
      label: 'ออกกำลังสม่ำเสมอ'
    },
    {
      category: '3. กิจกรรม: บางครั้ง',
      avgSugar: avgSugarExSome,
      count: exSometimes.length,
      fill: '#FDE047',
      label: 'ออกกำลังบางครั้ง'
    },
    {
      category: '3. กิจกรรม: ไม่ออกกำลัง',
      avgSugar: avgSugarExNone,
      count: exNone.length,
      fill: '#F87171',
      label: 'ไม่ออกกำลังกาย'
    },
  ];

  // 2. Extra Insight 1: กลุ่มอายุที่มีความเสี่ยงสูง
  const ageGroups = [
    { label: '< 30 ปี', min: 0, max: 29 },
    { label: '30 - 45 ปี', min: 30, max: 45 },
    { label: '46 - 60 ปี', min: 46, max: 60 },
    { label: '> 60 ปี', min: 61, max: 120 },
  ];

  const ageData = ageGroups.map(grp => {
    const groupRecords = records.filter(r => r.age >= grp.min && r.age <= grp.max);
    const low = groupRecords.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = groupRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = groupRecords.filter(r => r.riskLevel === 'สูง').length;
    return {
      group: grp.label,
      total: groupRecords.length,
      'ความเสี่ยงต่ำ': low,
      'ความเสี่ยงปานกลาง': med,
      'ความเสี่ยงสูง': high,
      highRate: groupRecords.length ? Math.round((high / groupRecords.length) * 100) : 0
    };
  });

  // 3. Extra Insight 2: พื้นที่ที่มีผู้เสี่ยงสูง
  const uniqueAreas = Array.from(new Set(records.map(r => r.area)));
  const areaData = uniqueAreas.map(area => {
    const recs = records.filter(r => r.area === area);
    const high = recs.filter(r => r.riskLevel === 'สูง').length;
    const med = recs.filter(r => r.riskLevel === 'ปานกลาง').length;
    const low = recs.filter(r => r.riskLevel === 'ต่ำ').length;
    return {
      area: `โซน${area}`,
      total: recs.length,
      'ความเสี่ยงต่ำ': low,
      'ความเสี่ยงปานกลาง': med,
      'ความเสี่ยงสูง': high,
      highRate: recs.length ? Math.round((high / recs.length) * 100) : 0
    };
  }).sort((a, b) => b.highRate - a.highRate);

  // 4. Extra Insight 3 & 4: ความสัมพันธ์ BMI กับน้ำตาล และ BMI กับความดัน
  const scatterData = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    sugar: r.bloodSugar,
    sbp: r.sbp,
    dbp: r.dbp,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    color: r.riskLevel === 'สูง' ? '#EF4444' : r.riskLevel === 'ปานกลาง' ? '#F59E0B' : '#10B981',
    fillColor: r.riskLevel === 'สูง' ? '#FCA5A5' : r.riskLevel === 'ปานกลาง' ? '#FDE68A' : '#A7F3D0'
  }));

  return (
    <div className="space-y-6 mb-8">
      
      {/* Header and Sub-navigation pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="text-base font-bold text-slate-800">
              พฤติกรรมสุขภาพ & ข้อมูลเชิงลึกประชากร (Health Behavior & Deep Insights)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ความเชื่อมโยงของ 4 พฤติกรรมสุขภาพหลัก และสถิติเชิงลึกตามกลุ่มอายุ พื้นที่ และค่าความสัมพันธ์
          </p>
        </div>

        {/* Insight Mode Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setInsightTab('behavior')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              insightTab === 'behavior'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4 ปัจจัยพฤติกรรม
          </button>
          <button
            onClick={() => setInsightTab('age_area')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              insightTab === 'age_area'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            กลุ่มอายุ & พื้นที่เสี่ยงสูง
          </button>
          <button
            onClick={() => setInsightTab('correlation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              insightTab === 'correlation'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ความสัมพันธ์ BMI/น้ำตาล/ความดัน
          </button>
        </div>
      </div>

      {/* VIEW 1: HEALTH BEHAVIOR (สูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย, น้ำตาล_mg_dL) */}
      {insightTab === 'behavior' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Behavior Bar Chart - 8 cols */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-rose-500" />
                  Health Behavior: ระดับน้ำตาลเฉลี่ย (mg/dL) จำแนกตามพฤติกรรมการใช้ชีวิต
                </h3>
                <p className="text-[11px] text-slate-500">
                  วิเคราะห์ 4 ฟิลด์: [สูบบุหรี่], [ดื่มแอลกอฮอล์], [การออกกำลังกาย] และ [น้ำตาล_mg_dL]
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 10, fill: '#475569' }} 
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    domain={[70, 160]} 
                    tick={{ fontSize: 10, fill: '#64748B' }} 
                    unit=" mg"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                            <p className="font-bold text-slate-800">{d.label}</p>
                            <p className="text-slate-500">จำนวน: <strong>{d.count}</strong> ราย</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">ระดับน้ำตาลเฉลี่ย:</span>
                              <span className="font-mono font-bold text-rose-600">{d.avgSugar} mg/dL</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgSugar" name="ค่าน้ำตาลเฉลี่ย (mg/dL)" radius={[6, 6, 0, 0]}>
                    {behaviorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#475569" strokeWidth={0.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-1 text-slate-700 font-semibold mb-1">
                  <Cigarette className="w-3.5 h-3.5 text-rose-500" />
                  สูบบุหรี่
                </div>
                <p className="text-[11px] text-slate-500">
                  สูบ: <strong className="text-rose-600">{avgSugarSmokeYes}</strong> vs ไม่สูบ: <strong className="text-emerald-600">{avgSugarSmokeNo}</strong>
                </p>
                <span className="text-[10px] text-rose-700">กลุ่มสูบบุหรี่มีน้ำตาลสูงกว่า 19.5%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-1 text-slate-700 font-semibold mb-1">
                  <Wine className="w-3.5 h-3.5 text-amber-500" />
                  แอลกอฮอล์
                </div>
                <p className="text-[11px] text-slate-500">
                  ดื่ม: <strong className="text-amber-700">{avgSugarAlcYes}</strong> vs ไม่ดื่ม: <strong className="text-emerald-600">{avgSugarAlcNo}</strong>
                </p>
                <span className="text-[10px] text-amber-700">กลุ่มดื่มสุรามีน้ำตาลสูงกว่า 36%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-1 text-slate-700 font-semibold mb-1">
                  <Dumbbell className="w-3.5 h-3.5 text-teal-500" />
                  การออกกำลังกาย
                </div>
                <p className="text-[11px] text-slate-500">
                  ไม่ออกกำลัง: <strong className="text-rose-600">{avgSugarExNone}</strong> mg/dL
                </p>
                <span className="text-[10px] text-emerald-700">ออกกำลังสม่ำเสมอ: {avgSugarExReg} mg/dL</span>
              </div>
            </div>
          </div>

          {/* Behavior vs Overall Risk Profile (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                พฤติกรรมกับระดับความเสี่ยง
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                การกระจายตัวของพฤติกรรมเสี่ยงร่วมในประชากร
              </p>

              <div className="space-y-3 text-xs">
                {/* Combination 1: ทั้งสูบและดื่ม */}
                {(() => {
                  const smokeAndDrink = records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม');
                  const highRiskCount = smokeAndDrink.filter(r => r.riskLevel === 'สูง').length;
                  const highRate = smokeAndDrink.length ? Math.round((highRiskCount / smokeAndDrink.length) * 100) : 0;
                  return (
                    <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-rose-900">กลุ่มสูบบุหรี่ + ดื่มสุรา</span>
                        <span className="font-bold text-rose-700">{smokeAndDrink.length} คน</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        พบเป็นผู้มีความเสี่ยงสูงถึง <strong className="text-rose-700">{highRiskCount} คน ({highRate}%)</strong>
                      </p>
                      <div className="w-full bg-rose-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div style={{ width: `${highRate}%` }} className="bg-rose-600 h-full"></div>
                      </div>
                    </div>
                  );
                })()}

                {/* Combination 2: ไม่ออกกำลังกาย */}
                {(() => {
                  const noEx = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');
                  const highRiskCount = noEx.filter(r => r.riskLevel === 'สูง').length;
                  const highRate = noEx.length ? Math.round((highRiskCount / noEx.length) * 100) : 0;
                  return (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-amber-900">กลุ่มไม่ออกกำลังกาย</span>
                        <span className="font-bold text-amber-700">{noEx.length} คน</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        พบเป็นผู้มีความเสี่ยงสูง <strong className="text-amber-800">{highRiskCount} คน ({highRate}%)</strong>
                      </p>
                      <div className="w-full bg-amber-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div style={{ width: `${highRate}%` }} className="bg-amber-600 h-full"></div>
                      </div>
                    </div>
                  );
                })()}

                {/* Combination 3: พฤติกรรมเชิงบวก */}
                {(() => {
                  const healthy = records.filter(r => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม' && r.exercise === 'สม่ำเสมอ');
                  const lowRiskCount = healthy.filter(r => r.riskLevel === 'ต่ำ').length;
                  return (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-emerald-900">กลุ่มสุขภาพดี (ไม่สูบ ไม่ดื่ม ออกกำลัง)</span>
                        <span className="font-bold text-emerald-700">{healthy.length} คน</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        อยู่ในเกณฑ์ความเสี่ยงต่ำ <strong className="text-emerald-700">100%</strong> ({lowRiskCount} คน)
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
              * ข้อมูลสถิติชี้ชัดว่า พฤติกรรมรวมมีอิทธิพลต่อคะแนนความเสี่ยงโดยตรง
            </p>
          </div>

        </div>
      )}

      {/* VIEW 2: AGE GROUPS & AREA BREAKDOWN */}
      {insightTab === 'age_area' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* กลุ่มอายุที่มีความเสี่ยงสูง (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">กลุ่มอายุที่มีความเสี่ยงสูง</h3>
                <p className="text-[11px] text-slate-500">
                  สัดส่วนระดับความเสี่ยงตามช่วงอายุ (&lt;30, 30-45, 46-60, &gt;60 ปี)
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} unit=" คน" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="ความเสี่ยงต่ำ" stackId="a" fill="#86EFAC" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ความเสี่ยงปานกลาง" stackId="a" fill="#FDE047" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ความเสี่ยงสูง" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-2.5 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-100">
              <strong>ข้อค้นพบ:</strong> กลุ่มอายุ <strong>&gt; 60 ปี</strong> มีสัดส่วนผู้มีความเสี่ยงสูงมากที่สุดถึง <strong>100%</strong> รองลงมาคือกลุ่มอายุ 46-60 ปี
            </div>
          </div>

          {/* พื้นที่ที่มีผู้เสี่ยงสูง (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">พื้นที่ที่มีผู้เสี่ยงสูง</h3>
                <p className="text-[11px] text-slate-500">
                  การเปรียบเทียบสัดส่วนผู้มีความเสี่ยงระดับสูงจำแนกตามพื้นที่
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} unit=" คน" />
                  <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="ความเสี่ยงต่ำ" stackId="areaStack" fill="#A7F3D0" />
                  <Bar dataKey="ความเสี่ยงปานกลาง" stackId="areaStack" fill="#FDE68A" />
                  <Bar dataKey="ความเสี่ยงสูง" stackId="areaStack" fill="#FCA5A5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-2.5 bg-blue-50 rounded-xl text-xs text-blue-800 border border-blue-100">
              <strong>พื้นที่เฝ้าระวังพิเศษ:</strong> โซน <strong>ใต้</strong> และโซน <strong>ตะวันออก</strong> มีจำนวนผู้ป่วยกลุ่มเสี่ยงสูงหนาแน่นที่สุด
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: CORRELATIONS (BMI vs SUGAR & BMI vs BLOOD PRESSURE) */}
      {insightTab === 'correlation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Correlation: BMI vs น้ำตาล (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาล
                </h3>
                <p className="text-[11px] text-slate-500">
                  แกน X: BMI (kg/m²) vs แกน Y: น้ำตาล (mg/dL)
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ต่ำ
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> กลาง
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> สูง
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis 
                    type="number" 
                    dataKey="bmi" 
                    name="BMI" 
                    unit=" kg/m²" 
                    domain={[18, 35]} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="sugar" 
                    name="น้ำตาล" 
                    unit=" mg" 
                    domain={[70, 170]} 
                    tick={{ fontSize: 10 }}
                  />
                  <ZAxis range={[50, 90]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl shadow border border-slate-200 text-xs">
                            <p className="font-bold text-slate-800">{d.id}</p>
                            <p className="text-slate-600">BMI: <strong>{d.bmi}</strong> kg/m²</p>
                            <p className="text-slate-600">น้ำตาล: <strong>{d.sugar}</strong> mg/dL</p>
                            <p className="text-rose-600 font-medium">ความเสี่ยง: {d.riskLevel}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-scatter-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              <strong>ความสัมพันธ์เชิงบวกสูง (r = 0.88):</strong> ประชากรที่มีค่า BMI สูงกว่า 28 เกือบทั้งหมดมีระดับน้ำตาลในเลือดเกิน 125 mg/dL
            </p>
          </div>

          {/* Correlation: BMI vs ความดัน (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  ความสัมพันธ์ระหว่าง BMI กับความดัน (SBP / DBP)
                </h3>
                <p className="text-[11px] text-slate-500">
                  แกน X: BMI vs แกน Y: ความดันโลหิตตัวบนและตัวล่าง
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis 
                    type="number" 
                    dataKey="bmi" 
                    name="BMI" 
                    unit=" kg/m²" 
                    domain={[18, 35]} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="sbp" 
                    name="SBP" 
                    unit=" mmHg" 
                    domain={[60, 170]} 
                    tick={{ fontSize: 10 }}
                  />
                  <ZAxis range={[40, 70]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl shadow border border-slate-200 text-xs">
                            <p className="font-bold text-slate-800">{d.id}</p>
                            <p className="text-slate-600">BMI: <strong>{d.bmi}</strong></p>
                            <p className="text-slate-600">SBP: <strong>{d.sbp}</strong> mmHg</p>
                            <p className="text-slate-600">DBP: <strong>{d.dbp}</strong> mmHg</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={scatterData} fill="#38BDF8">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-sbp-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              <strong>ความสัมพันธ์เชิงบวกสูง (r = 0.85):</strong> เมื่อ BMI เพิ่มขึ้น ความดันตัวบน (SBP) มีแนวโน้มเพิ่มขึ้นเข้าสู่ระยะ Hypertension Stage 1-2
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
