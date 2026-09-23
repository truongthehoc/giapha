'use client';

import React, { useEffect, useState } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wallet, 
  Award, 
  Search, 
  Filter, 
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { ClanFund, FundTransaction } from '@/lib/types';

export default function FundsPage() {
  const [funds, setFunds] = useState<ClanFund[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedFundId, setSelectedFundId] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fundId: '',
    contributorName: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    amount: 1000000,
    transactionDate: new Date().toISOString().split('T')[0],
    purpose: '',
  });

  const loadFundsData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/funds');
      const data = await res.json();
      setFunds(data.funds || []);
      setTransactions(data.transactions || []);
      setTotalBalance(data.totalBalance || 0);
      setTotalIncome(data.totalIncome || 0);
      setTotalExpense(data.totalExpense || 0);
      if (data.funds?.length > 0 && !formData.fundId) {
        setFormData((prev) => ({ ...prev, fundId: data.funds[0].id }));
      }
    } catch (err) {
      console.error('Failed to load funds', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundsData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      loadFundsData();
    } catch (err) {
      console.error('Lỗi ghi nhận giao dịch', err);
    }
  };

  const filteredTransactions = selectedFundId === 'ALL'
    ? transactions
    : transactions.filter((t) => t.fundId === selectedFundId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ead8c0] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#341d13] flex items-center gap-3">
            <Coins className="w-8 h-8 text-amber-700" />
            Quản Lý Quỹ Dòng Họ & Công Đức
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Minh bạch sổ sách tài chính, quản lý thu chi và vinh danh những tấm lòng thơm thảo của con cháu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Ghi Nhận Đóng Góp / Thu Chi
        </button>
      </div>

      {/* 3 THẺ TỔNG QUAN TÀI CHÍNH */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-100 text-amber-800">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-stone-500">Tổng Số Dư Khả Dụng</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-800 mt-0.5">
              {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800">
            <ArrowDownLeft className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-stone-500">Tổng Thu / Công Đức</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-emerald-700 mt-0.5">
              {formatCurrency(totalIncome)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-rose-100 text-rose-800">
            <ArrowUpRight className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-stone-500">Tổng Chi Tiêu</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif text-rose-700 mt-0.5">
              {formatCurrency(totalExpense)}
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÁC DANH MỤC QUỸ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#341d13] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-amber-700" />
          Các Danh Mục Quỹ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funds.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#ead8c0] space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold font-serif text-lg text-[#341d13]">{f.name}</h3>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Coins className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed min-h-[36px]">
                {f.description}
              </p>
              <div className="pt-2 border-t border-[#f4ede0] flex items-baseline justify-between">
                <span className="text-xs text-stone-500">Số dư hiện nay:</span>
                <span className="text-lg font-bold font-serif text-emerald-700">
                  {formatCurrency(f.currentBalance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LỊCH SỬ THU CHI & BẢNG VÀNG */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#ead8c0] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ead8c0] pb-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#341d13]">
              Nhật Ký Giao Dịch Thu Chi
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Danh sách các khoản đóng góp và chi tiêu được cập nhật công khai
            </p>
          </div>

          <select
            value={selectedFundId}
            onChange={(e) => setSelectedFundId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] text-xs sm:text-sm font-semibold text-[#341d13]"
          >
            <option value="ALL">-- Tất cả các quỹ --</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bảng giao dịch */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-[#fbf7f0] text-xs uppercase font-bold text-amber-900 border-b border-[#ddbd9b]">
              <tr>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Người Đóng Góp / Thực Hiện</th>
                <th className="py-3 px-4">Quỹ</th>
                <th className="py-3 px-4">Nội Dung / Mục Đích</th>
                <th className="py-3 px-4 text-right">Số Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede0]">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'INCOME';
                return (
                  <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 text-xs text-stone-500 whitespace-nowrap">
                      {tx.transactionDate}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#341d13]">
                      {tx.contributorName}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">
                      {tx.fundName}
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm">
                      {tx.purpose}
                    </td>
                    <td className={`py-3 px-4 font-bold text-right whitespace-nowrap ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM GIAO DỊCH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ead8c0] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#ead8c0] pb-4">
              <h3 className="text-xl font-bold font-serif text-[#341d13]">
                Ghi Nhận Giao Dịch Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Loại Giao Dịch *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  >
                    <option value="INCOME">Thu / Công Đức (+)</option>
                    <option value="EXPENSE">Chi Tiêu (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Thuộc Quỹ *</label>
                  <select
                    value={formData.fundId}
                    onChange={(e) => setFormData({ ...formData, fundId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  >
                    {funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên người đóng góp / Người nhận *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ông Nguyễn Văn A hoặc Ban Quản Trị"
                  value={formData.contributorName}
                  onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Số Tiền (VNĐ) *</label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ngày Giao Dịch *</label>
                  <input
                    type="date"
                    required
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mục Đích / Lý Do *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công đức trùng tu Từ đường..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#ead8c0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold"
                >
                  Ghi Vào Sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
