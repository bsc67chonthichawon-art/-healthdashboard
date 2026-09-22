import React from 'react';
import { Filter, RotateCcw, MapPin, Users, AlertTriangle } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  areasList: string[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  areasList,
}) => {
  const isFiltered =
    filters.area !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Filter Title & Label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100/70 text-rose-700 flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">ระบบคัดกรองข้อมูล (Filters)</h2>
            <p className="text-xs text-slate-500">เลือกเงื่อนไขเพื่อวิเคราะห์กลุ่มประชากรเป้าหมายเฉพาะส่วน</p>
          </div>
        </div>

        {/* 3 Main Filters as required */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-3xl">
          
          {/* 1. Filter: พื้นที่ */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              1. พื้นที่ (Area)
            </label>
            <select
              id="filter-area"
              value={filters.area}
              onChange={(e) => onFilterChange({ area: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-medium"
            >
              <option value="ทั้งหมด">พื้นที่ทั้งหมด ({areasList.length} โซน)</option>
              {areasList.map((area) => (
                <option key={area} value={area}>
                  โซน{area}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter: เพศ */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              2. เพศ (Gender)
            </label>
            <select
              id="filter-gender"
              value={filters.gender}
              onChange={(e) => onFilterChange({ gender: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-medium"
            >
              <option value="ทั้งหมด">ทุกเพศ (ชาย & หญิง)</option>
              <option value="ชาย">เพศชาย</option>
              <option value="หญิง">เพศหญิง</option>
            </select>
          </div>

          {/* 3. Filter: ระดับความเสี่ยง */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-slate-400" />
              3. ระดับความเสี่ยง (Risk Level)
            </label>
            <select
              id="filter-risk"
              value={filters.riskLevel}
              onChange={(e) => onFilterChange({ riskLevel: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-medium"
            >
              <option value="ทั้งหมด">ทุกระดับความเสี่ยง</option>
              <option value="ต่ำ">ความเสี่ยงต่ำ (สีเขียว)</option>
              <option value="ปานกลาง">ความเสี่ยงปานกลาง (สีเหลือง)</option>
              <option value="สูง">ความเสี่ยงสูง (สีแดง)</option>
            </select>
          </div>

        </div>

        {/* Counter and Reset */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="text-xs text-slate-500">
            แสดง <strong className="text-slate-800 text-sm">{filteredCount}</strong> จาก{' '}
            <span className="text-slate-600">{totalCount} ราย</span>
            <span className="ml-1 text-[11px] text-slate-400">
              ({totalCount > 0 ? Math.round((filteredCount / totalCount) * 100) : 0}%)
            </span>
          </div>

          {isFiltered && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="ล้างตัวกรองทั้งหมด"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตตัวกรอง</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
