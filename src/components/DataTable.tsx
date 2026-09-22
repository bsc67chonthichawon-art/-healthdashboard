import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  FileSpreadsheet
} from 'lucide-react';
import { HealthRecord } from '../types';

interface DataTableProps {
  records: HealthRecord[];
  onSelectRecord: (record: HealthRecord) => void;
}

type SortField = 'id' | 'screenDate' | 'age' | 'bmi' | 'sbp' | 'dbp' | 'bloodSugar' | 'riskScore' | 'riskLevel';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ records, onSelectRecord }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered by internal search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.gender.toLowerCase().includes(q) ||
        r.riskLevel.toLowerCase().includes(q) ||
        r.screenDate.toLowerCase().includes(q) ||
        String(r.age).includes(q) ||
        r.smoking.toLowerCase().includes(q) ||
        r.alcohol.toLowerCase().includes(q)
    );
  }, [records, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'screenDate') {
        aVal = a.dateTimestamp;
        bVal = b.dateTimestamp;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง'
    ];

    const rows = sorted.map(r => [
      r.id,
      r.screenDate,
      r.area,
      r.gender,
      r.age,
      r.heightCm,
      r.weightKg,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesScreen,
      r.hypertensionScreen,
      r.riskScore,
      r.riskLevel
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `health_risk_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-8">
      
      {/* Top Header of Table */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h2 className="text-base font-bold text-slate-800">
              ส่วนรายละเอียดเชิงลึก: วิเคราะห์รายละเอียดปัจจัยเสี่ยงด้านสุขภาพรายบุคคล
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบจำแนกและระบายสีเน้นข้อมูล (Conditional Formatting): 
            <span className="ml-1 text-emerald-700 font-medium">สีเขียว = ความเสี่ยงต่ำ</span>, 
            <span className="ml-1 text-amber-700 font-medium">สีเหลือง = ความเสี่ยงปานกลาง</span>, 
            <span className="ml-1 text-rose-700 font-medium">สีแดง = ความเสี่ยงสูง</span>
          </p>
        </div>

        {/* Search and Export Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหารหัสบุคคล, พื้นที่, เพศ..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-200 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200/80"
            title="ดาวน์โหลดเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold select-none">
            <tr>
              <th 
                onClick={() => handleSort('id')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>รหัสบุคคล</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('screenDate')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>วันที่คัดกรอง</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-3">พื้นที่</th>
              <th className="py-3 px-2 text-center">เพศ</th>
              
              <th 
                onClick={() => handleSort('age')}
                className="py-3 px-2 text-center cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span>อายุ</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('bmi')}
                className="py-3 px-2.5 text-right cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BMI</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('sbp')}
                className="py-3 px-2.5 text-right cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SBP/DBP</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('bloodSugar')}
                className="py-3 px-2.5 text-right cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>น้ำตาล (mg/dL)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-3">พฤติกรรม (บุหรี่/สุรา/กีฬา)</th>

              <th 
                onClick={() => handleSort('riskScore')}
                className="py-3 px-2.5 text-center cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>คะแนนเสี่ยง</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('riskLevel')}
                className="py-3 px-3.5 text-center cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>ระดับความเสี่ยง (Conditional)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-3 text-center">ดูรายละเอียด</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลตามคำค้นหา
                </td>
              </tr>
            ) : (
              paginated.map((r) => {
                // Conditional Formatting for rows and badges
                // สีเขียว = ความเสี่ยงต่ำ, สีเหลือง = ความเสี่ยงปานกลาง, สีแดง = ความเสี่ยงสูง
                const isHigh = r.riskLevel === 'สูง';
                const isMed = r.riskLevel === 'ปานกลาง';
                const isLow = r.riskLevel === 'ต่ำ';

                const rowBgClass = isHigh
                  ? 'bg-rose-50/35 hover:bg-rose-50/70 border-l-4 border-l-rose-500'
                  : isMed
                  ? 'bg-amber-50/35 hover:bg-amber-50/70 border-l-4 border-l-amber-500'
                  : 'bg-emerald-50/25 hover:bg-emerald-50/60 border-l-4 border-l-emerald-500';

                return (
                  <tr 
                    key={r.id} 
                    className={`transition-colors cursor-pointer ${rowBgClass}`}
                    onClick={() => onSelectRecord(r)}
                  >
                    {/* รหัสบุคคล */}
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {r.id}
                    </td>

                    {/* วันที่คัดกรอง */}
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {r.screenDate}
                    </td>

                    {/* พื้นที่ */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      โซน{r.area}
                    </td>

                    {/* เพศ */}
                    <td className="py-2.5 px-2 text-center text-slate-600 whitespace-nowrap">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium ${r.gender === 'ชาย' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-pink-50 text-pink-700 border border-pink-200'}`}>
                        {r.gender}
                      </span>
                    </td>

                    {/* อายุ */}
                    <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                      {r.age}
                    </td>

                    {/* BMI */}
                    <td className="py-2.5 px-2.5 text-right font-mono">
                      <span className={`font-semibold ${r.bmi >= 25 ? 'text-rose-600' : r.bmi >= 23 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {r.bmi}
                      </span>
                    </td>

                    {/* SBP/DBP */}
                    <td className="py-2.5 px-2.5 text-right font-mono whitespace-nowrap">
                      <span className={r.sbp >= 140 ? 'text-rose-600 font-bold' : r.sbp >= 120 ? 'text-amber-600 font-medium' : 'text-slate-700'}>
                        {r.sbp}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span className={r.dbp >= 90 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {r.dbp}
                      </span>
                    </td>

                    {/* น้ำตาล */}
                    <td className="py-2.5 px-2.5 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        r.bloodSugar >= 126 
                          ? 'bg-rose-100 text-rose-800' 
                          : r.bloodSugar >= 100 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.bloodSugar}
                      </span>
                    </td>

                    {/* พฤติกรรม */}
                    <td className="py-2.5 px-3 text-[11px] text-slate-600 whitespace-nowrap">
                      <span className={r.smoking === 'สูบ' ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                        {r.smoking}
                      </span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span className={r.alcohol === 'ดื่ม' ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
                        {r.alcohol}
                      </span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span className={r.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-500' : 'text-slate-500'}>
                        {r.exercise}
                      </span>
                    </td>

                    {/* คะแนนเสี่ยง */}
                    <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-800">
                      {r.riskScore}
                    </td>

                    {/* ระดับความเสี่ยง - CONDITIONAL FORMATTING */}
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      {isLow && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ความเสี่ยงต่ำ
                        </span>
                      )}
                      {isMed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          ความเสี่ยงปานกลาง
                        </span>
                      )}
                      {isHigh && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                          <ShieldX className="w-3.5 h-3.5 text-rose-600" />
                          ความเสี่ยงสูง
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center" onClick={(e) => { e.stopPropagation(); onSelectRecord(r); }}>
                      <button 
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="คลิกดูรายงานสุขภาพรายบุคคล"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          แสดงผลหน้า {currentPage} จากทั้งหมด {totalPages} หน้า (ทั้งหมด {sorted.length} รายการ)
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
              currentPage === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                currentPage === num
                  ? 'bg-rose-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
              currentPage === totalPages ? 'opacity-40 cursor-not-allowed text-slate-400' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
