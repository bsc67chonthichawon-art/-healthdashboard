import React from 'react';
import { 
  X, 
  Activity, 
  Heart, 
  Droplets, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  User,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from 'lucide-react';
import { HealthRecord } from '../types';

interface IndividualDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const IndividualDetailModal: React.FC<IndividualDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  // Helper for styling risk
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'สูง':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <ShieldX className="w-4 h-4 text-rose-600" />,
          cardBg: 'bg-rose-50/50 border-rose-200',
          color: 'text-rose-600'
        };
      case 'ปานกลาง':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
          cardBg: 'bg-amber-50/50 border-amber-200',
          color: 'text-amber-600'
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          cardBg: 'bg-emerald-50/50 border-emerald-200',
          color: 'text-emerald-600'
        };
    }
  };

  const riskBadge = getRiskBadge(record.riskLevel);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  เวชระเบียนข้อมูลรายบุคคล: {record.id}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadge.bg}`}>
                  {riskBadge.icon}
                  ความเสี่ยง: {record.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                คัดกรองเมื่อ: {record.screenDate} • โซน: {record.area} • เพศ: {record.gender} • อายุ: {record.age} ปี
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Risk Score Summary Banner */}
          <div className={`p-4 rounded-2xl border ${riskBadge.cardBg} flex items-center justify-between`}>
            <div>
              <span className="text-xs font-medium text-slate-600">คะแนนความเสี่ยงสะสม (Risk Score):</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-2xl font-black font-mono ${riskBadge.color}`}>
                  {record.riskScore}
                </span>
                <span className="text-xs text-slate-500">/ 7 คะแนนเต็ม</span>
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <p className="text-slate-600">
                คัดกรองเบาหวาน: <strong className={record.diabetesScreen.includes('เสี่ยง') ? 'text-rose-600' : 'text-emerald-700'}>{record.diabetesScreen}</strong>
              </p>
              <p className="text-slate-600">
                คัดกรองความดันสูง: <strong className={record.hypertensionScreen.includes('เสี่ยง') ? 'text-rose-600' : 'text-emerald-700'}>{record.hypertensionScreen}</strong>
              </p>
            </div>
          </div>

          {/* Vitals & Biometrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              ข้อมูลชีวภาพและสัญญาณชีพ
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 block">ส่วนสูง / น้ำหนัก</span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {record.heightCm} cm / {record.weightKg} kg
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 block">ดัชนีมวลกาย (BMI)</span>
                <span className={`text-sm font-bold font-mono ${record.bmi >= 25 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {record.bmi}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  {record.bmi >= 25 ? '(ภาวะอ้วน)' : record.bmi >= 23 ? '(ท้วม)' : '(ปกติ)'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 block">ความดัน (SBP/DBP)</span>
                <span className={`text-sm font-bold font-mono ${record.sbp >= 140 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {record.sbp}/{record.dbp}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">mmHg</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 block">น้ำตาลในเลือด</span>
                <span className={`text-sm font-bold font-mono ${record.bloodSugar >= 126 ? 'text-rose-600' : record.bloodSugar >= 100 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {record.bloodSugar}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">mg/dL</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Behaviors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-teal-500" />
              พฤติกรรมการดำเนินชีวิต
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${record.smoking === 'สูบ' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <span className="block text-[11px] opacity-80">การสูบบุหรี่</span>
                <strong className="text-sm font-semibold">{record.smoking}</strong>
              </div>

              <div className={`p-3 rounded-xl border ${record.alcohol === 'ดื่ม' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                <span className="block text-[11px] opacity-80">การดื่มแอลกอฮอล์</span>
                <strong className="text-sm font-semibold">{record.alcohol}</strong>
              </div>

              <div className={`p-3 rounded-xl border ${record.exercise === 'ไม่ออกกำลังกาย' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-teal-50 border-teal-200 text-teal-800'}`}>
                <span className="block text-[11px] opacity-80">การออกกำลังกาย</span>
                <strong className="text-sm font-semibold">{record.exercise}</strong>
              </div>
            </div>
          </div>

          {/* Clinical Recommendation & Advice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              ข้อเสนอแนะทางการพยาบาลและเวชระเบียนชุมชน
            </h4>
            {record.riskLevel === 'สูง' ? (
              <p className="text-slate-600 leading-relaxed">
                🚨 <strong>แผนดูแลเร่งด่วน:</strong> ควรส่งต่อพบแพทย์เพื่อตรวจประเมินระดับน้ำตาลสะสม (HbA1c) และความดันโลหิตซ้ำ แนะนำให้ปรับพฤติกรรมลดอาหารหวาน มัน เค็ม งดสูบบุหรี่และสุราเด็ดขาด พร้อมนัดติดตามผลภายใน 2-4 สัปดาห์
              </p>
            ) : record.riskLevel === 'ปานกลาง' ? (
              <p className="text-slate-600 leading-relaxed">
                ⚠️ <strong>แผนดูแลเฝ้าระวัง:</strong> แนะนำให้เพิ่มกิจกรรมทางกายอย่างน้อย 150 นาทีต่อสัปดาห์ ควบคุมน้ำหนักให้อยู่ในเกณฑ์ และตรวจติดตามสัญญาณชีพซ้ำทุก 3-6 เดือน
              </p>
            ) : (
              <p className="text-slate-600 leading-relaxed">
                ✅ <strong>แผนการส่งเสริมสุขภาพ:</strong> สุขภาพอยู่ในเกณฑ์ดี แนะนำให้รักษาพฤติกรรมบวกต่อเนื่อง ทั้งการออกกำลังกายสม่ำเสมอและรับประทานอาหารครบ 5 หมู่ พร้อมตรวจสุขภาพประจำปี
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white transition-all shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
