import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  HeartHandshake, 
  FileSpreadsheet,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from 'lucide-react';
import { ActiveTab, HealthRecord } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  filteredRecords: HealthRecord[];
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  filteredRecords
}) => {
  const lowCount = filteredRecords.filter(r => r.riskLevel === 'ต่ำ').length;
  const medCount = filteredRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
  const highCount = filteredRecords.filter(r => r.riskLevel === 'สูง').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'ภาพรวม & KPI สุขภาพ',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'risk_trend',
      label: 'วิเคราะห์ความเสี่ยง & แนวโน้ม',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'behavior_insights',
      label: 'พฤติกรรม & ปัจจัยสัมพันธ์',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      id: 'records_table',
      label: 'ข้อมูลรายบุคคลเชิงลึก',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: `${filteredRecords.length}`
    },
  ];

  return (
    <div className="bg-white/90 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" aria-label="Tabs" id="nav-dashboard-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-100/80 text-rose-800 shadow-xs border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-rose-600' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick summary status tags */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 self-end md:self-center shrink-0">
          <span className="hidden sm:inline text-slate-400">สรุปความเสี่ยง:</span>
          
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
            title="ความเสี่ยงต่ำ: สีเขียว"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ต่ำ: <strong>{lowCount}</strong></span>
          </div>

          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200"
            title="ความเสี่ยงปานกลาง: สีเหลือง"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>ปานกลาง: <strong>{medCount}</strong></span>
          </div>

          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200"
            title="ความเสี่ยงสูง: สีแดง"
          >
            <ShieldX className="w-3.5 h-3.5 text-rose-500" />
            <span>สูง: <strong>{highCount}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
