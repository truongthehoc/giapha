'use client';

import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRightLeft, 
  UserCheck, 
  HelpCircle, 
  Award, 
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { Person } from '@/lib/types';
import { KinshipResult } from '@/lib/kinship';

export default function KinshipPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [personAId, setPersonAId] = useState<string>('');
  const [personBId, setPersonBId] = useState<string>('');
  const [result, setResult] = useState<KinshipResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPersons() {
      try {
        const res = await fetch('/api/members');
        const data = await res.json();
        const list = data.members || [];
        setPersons(list);
        if (list.length >= 2) {
          setPersonAId(list[0].id);
          setPersonBId(list[list.length - 1].id);
        }
      } catch (err) {
        console.error('Failed to load persons for kinship', err);
      }
    }
    loadPersons();
  }, []);

  const handleCalculate = async () => {
    if (!personAId || !personBId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/kinship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personAId, personBId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Không xác định được quan hệ');
        setResult(null);
      }
    } catch (err) {
      setError('Lỗi khi phân tích quan hệ');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (idA: string, idB: string) => {
    setPersonAId(idA);
    setPersonBId(idB);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-700" />
          Thuật Toán Gia Phả Thông Minh
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#341d13]">
          Tra Cứu Xưng Hô & Vai Vế Họ Hàng
        </h1>
        <p className="text-sm text-stone-600">
          Chọn hai người bất kỳ trong dòng họ để hệ thống tự động xác định mối quan hệ huyết thống và cách xưng hô chuẩn mực theo truyền thống Việt Nam.
        </p>
      </div>

      {/* KHU VỰC CHỌN NGƯỜI A VÀ NGƯỜI B */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#ead8c0] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Người thứ nhất (A) */}
          <div className="p-5 rounded-2xl bg-[#fbf7f0] border border-[#ddbd9b] space-y-3">
            <label className="block text-xs font-bold text-amber-900 uppercase">
              Người thứ nhất (A)
            </label>
            <select
              value={personAId}
              onChange={(e) => setPersonAId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfa074] bg-white text-sm font-semibold text-[#341d13] focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} (Đời {p.generationLevel} - {p.gender === 'MALE' ? 'Nam' : 'Nữ'})
                </option>
              ))}
            </select>

            {personAId && (
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>Đang chọn: <strong>{persons.find((p) => p.id === personAId)?.fullName}</strong></span>
              </div>
            )}
          </div>

          {/* Người thứ hai (B) */}
          <div className="p-5 rounded-2xl bg-[#fbf7f0] border border-[#ddbd9b] space-y-3">
            <label className="block text-xs font-bold text-amber-900 uppercase">
              Người thứ hai (B)
            </label>
            <select
              value={personBId}
              onChange={(e) => setPersonBId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfa074] bg-white text-sm font-semibold text-[#341d13] focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} (Đời {p.generationLevel} - {p.gender === 'MALE' ? 'Nam' : 'Nữ'})
                </option>
              ))}
            </select>

            {personBId && (
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>Đang chọn: <strong>{persons.find((p) => p.id === personBId)?.fullName}</strong></span>
              </div>
            )}
          </div>

        </div>

        {/* Nút Tra cứu */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleCalculate}
            disabled={loading || !personAId || !personBId}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            {loading ? 'Đang Phân Tích Cây...' : 'Phân Tích Quan Hệ & Xưng Hô'}
          </button>
        </div>

        {/* Preset ví dụ nhanh */}
        {persons.length >= 4 && (
          <div className="pt-4 border-t border-[#f4ede0] flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Thử ví dụ mẫu:</span>
            <button
              onClick={() => setPreset('p-1', 'p-5-1')}
              className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              Thủy Tổ vs Cháu Đời 5
            </button>
            <button
              onClick={() => setPreset('p-4-1', 'p-5-3')}
              className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              Bác Đời 4 vs Cháu Đời 5
            </button>
            <button
              onClick={() => setPreset('p-5-1', 'p-5-4')}
              className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              Hai Anh Em Họ Cùng Đời 5
            </button>
          </div>
        )}
      </div>

      {/* KẾT QUẢ PHÂN TÍCH */}
      {result && (
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-500/40 space-y-6 animate-in fade-in slide-in-from-bottom-3">
          
          <div className="flex items-center justify-between border-b border-[#ead8c0] pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                Kết Quả Phân Tích
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#341d13] mt-0.5">
                {result.relationshipName}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Hộp Xưng Hô 2 Chiều */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#ead8c0] shadow-sm space-y-1 text-center">
              <div className="text-xs font-semibold text-stone-500 uppercase">
                {result.personA.fullName} gọi {result.personB.fullName} là:
              </div>
              <div className="text-2xl font-bold font-serif text-amber-700">
                &ldquo;{result.callAToB}&rdquo;
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#ead8c0] shadow-sm space-y-1 text-center">
              <div className="text-xs font-semibold text-stone-500 uppercase">
                {result.personB.fullName} gọi {result.personA.fullName} là:
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-700">
                &ldquo;{result.callBToA}&rdquo;
              </div>
            </div>
          </div>

          {/* Giải thích chi tiết */}
          <div className="p-4 rounded-2xl bg-[#fbf7f0] border border-[#ddbd9b] space-y-2 text-sm">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-700" />
              Chi Tiết Phả Hệ & Thứ Bậc:
            </div>
            <p className="text-stone-700 leading-relaxed">
              {result.explanation}
            </p>
            {result.commonAncestorName && (
              <div className="text-xs text-stone-500 pt-1">
                Tổ tiên chung gần nhất: <span className="font-semibold text-amber-900">{result.commonAncestorName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm text-center">
          {error}
        </div>
      )}

    </div>
  );
}
