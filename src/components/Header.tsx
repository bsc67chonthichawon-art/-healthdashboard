import React from 'react';
import { RefreshCw, ExternalLink, Activity, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { SHEET_ID, SHEET_VIEW_URL } from '../services/sheetService';

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  totalRecords
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-rose-100/60 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title and metadata */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                ระบบเวชระเบียน & สุขภาพชุมชน
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
                <Database className="w-3 h-3 text-slate-500" />
                Sheet ID: {SHEET_ID.slice(0, 10)}...
              </span>
              {isLive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200">
                  <CheckCircle2 className="w-3 h-3 text-teal-500" />
                  เชื่อมต่อ Google Sheet แบบเรียลไทม์
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  แคชข้อมูลออฟไลน์ที่ซิงค์แล้ว
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
              Dashboardวิเคราะห์ข้อมูลสุขภาพและพฤติกรรมการดำเนินชีวิตเพื่อประเมินระดับความเสี่ยงด้านสุขภาพของประชากร
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              การวิเคราะห์เชิงลึกปัจจัยเสี่ยงโรคไม่ติดต่อเรื้อรัง (NCDs) สัญญาณชีพอัตราเสี่ยง และพฤติกรรมการดำเนินชีวิตเพื่อการส่งเสริมสุขภาพเชิงรุก
            </p>

            {/* Creator & Timestamp */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-rose-700/90">ผู้จัดทำ:</span>
                <span className="bg-rose-50 px-2 py-0.5 rounded text-rose-800 font-medium border border-rose-200/60">
                  นางสาวชลธิชา วงศ์สุวรรณ์ นักศึกษาเวชระเบียนชั้นปีที่ 3
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="font-medium text-slate-700">อัปเดตข้อมูลล่าสุด:</span>
                <span className="font-mono text-slate-600">{lastUpdated || 'กำลังดึงข้อมูล...'}</span>
              </div>
              <div className="text-slate-500">
                ฐานข้อมูลประชากร: <strong className="text-slate-700">{totalRecords}</strong> ราย
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs ${
                isLoading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 active:scale-95'
              }`}
              title="รีเฟรชข้อมูลล่าสุดจาก Google Sheets"
              id="btn-refresh-data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : 'text-emerald-600'}`} />
              <span>{isLoading ? 'กำลังซิงค์ข้อมูล...' : 'รีเฟรชข้อมูล'}</span>
            </button>

            <a
              href={SHEET_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all hover:text-slate-900"
              title="เปิดดูแหล่งข้อมูลใน Google Sheets"
              id="link-google-sheet"
            >
              <span>เปิด Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
