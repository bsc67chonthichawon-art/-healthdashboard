import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState, ActiveTab } from './types';
import { fetchHealthRecordsFromSheet } from './services/sheetService';
import { fallbackRecords } from './data/fallbackData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FiltersBar } from './components/FiltersBar';
import { KPICards } from './components/KPICards';
import { RiskTrendSection } from './components/RiskTrendSection';
import { BehaviorInsightsSection } from './components/BehaviorInsightsSection';
import { DataTable } from './components/DataTable';
import { IndividualDetailModal } from './components/IndividualDetailModal';
import { RefreshCw, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(fallbackRecords);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal for individual detail view
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // Filters state (Area, Gender, RiskLevel, Search)
  const [filters, setFilters] = useState<FilterState>({
    area: 'ทั้งหมด',
    gender: 'ทั้งหมด',
    riskLevel: 'ทั้งหมด',
    searchQuery: '',
  });

  // Refresh data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchHealthRecordsFromSheet();
      setRecords(result.records);
      setIsLive(result.isLive);
      setLastUpdated(result.lastUpdated);
      if (result.errorMessage) {
        setErrorMessage(result.errorMessage);
      }
    } catch (err: unknown) {
      console.error('Error fetching sheet:', err);
      setErrorMessage(err instanceof Error ? err.message : 'ไม่สามารถดึงข้อมูลได้');
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Distinct areas list
  const areasList = useMemo(() => {
    const set = new Set(records.map((r) => r.area));
    return Array.from(set).filter(Boolean);
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Filter: พื้นที่
      if (filters.area !== 'ทั้งหมด' && r.area !== filters.area) {
        return false;
      }
      // 2. Filter: เพศ
      if (filters.gender !== 'ทั้งหมด' && r.gender !== filters.gender) {
        return false;
      }
      // 3. Filter: ระดับความเสี่ยง
      if (filters.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filters.riskLevel) {
        return false;
      }
      return true;
    });
  }, [records, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      area: 'ทั้งหมด',
      gender: 'ทั้งหมด',
      riskLevel: 'ทั้งหมด',
      searchQuery: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-800">
      
      {/* 1. Header & Live Refresh Controls */}
      <Header
        lastUpdated={lastUpdated}
        isLive={isLive}
        isLoading={isLoading}
        onRefresh={loadData}
        totalRecords={records.length}
      />

      {/* 5. Navigation Controls */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filteredRecords={filteredRecords}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Error / Notice Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>สถานะการเชื่อมต่อ:</strong> กำลังแสดงข้อมูลจากแคชระบบ ({errorMessage})
              </span>
            </div>
            <button
              onClick={loadData}
              className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-medium transition-colors"
            >
              ลองเชื่อมต่อใหม่
            </button>
          </div>
        )}

        {/* 1. Filters Bar (พื้นที่, เพศ, ระดับความเสี่ยง) */}
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
          areasList={areasList}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 2. KPI Cards / Summary Cards */}
            <KPICards records={filteredRecords} />
            
            {/* Quick preview of Risk & Trend */}
            <RiskTrendSection records={filteredRecords} />

            {/* Quick preview of Behavior */}
            <BehaviorInsightsSection records={filteredRecords} />

            {/* Data Table */}
            <DataTable 
              records={filteredRecords} 
              onSelectRecord={setSelectedRecord} 
            />
          </div>
        )}

        {activeTab === 'risk_trend' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <KPICards records={filteredRecords} />
            <RiskTrendSection records={filteredRecords} />
          </div>
        )}

        {activeTab === 'behavior_insights' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <BehaviorInsightsSection records={filteredRecords} />
          </div>
        )}

        {activeTab === 'records_table' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DataTable 
              records={filteredRecords} 
              onSelectRecord={setSelectedRecord} 
            />
          </div>
        )}

      </main>

      {/* Individual Detail Modal */}
      {selectedRecord && (
        <IndividualDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-700">
              Dashboardวิเคราะห์ข้อมูลสุขภาพและพฤติกรรมการดำเนินชีวิตเพื่อประเมินระดับความเสี่ยงด้านสุขภาพของประชากร
            </p>
            <p className="text-slate-400 mt-0.5">
              จัดทำโดย: <strong className="text-rose-700">นางสาวชลธิชา วงศ์สุวรรณ์ นักศึกษาเวชระเบียนชั้นปีที่ 3</strong> • แหล่งข้อมูล: Google Sheet ID 1rr2wRRTBFIxnMItBuFFkgzGKo8Yekqf8hz7iup5K9UQ
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>ระบบอัปเดตข้อมูลอัตโนมัติ</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">สถิติเป็นปัจจุบัน</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
