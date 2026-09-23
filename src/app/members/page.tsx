'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  Calendar, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { Person, Branch } from '@/lib/types';
import { solarToLunar } from '@/lib/amlich';

export default function MembersPage() {
  const [members, setMembers] = useState<Person[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Person | null>(null);
  const [detailMember, setDetailMember] = useState<Person | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    courtesyName: '',
    posthumousName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    branchId: '',
    generationLevel: 5,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '',
    dobLunarDay: 1,
    dobLunarMonth: 1,
    dobLunarYear: '',
    dodSolar: '',
    dodLunarDay: 1,
    dodLunarMonth: 1,
    dodLunarYear: '',
    burialPlace: '',
    biography: '',
    phone: '',
    email: '',
    currentResidence: '',
    parentIds: [] as string[],
    spouseId: '',
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (branchFilter) params.append('branchId', branchFilter);
      if (generationFilter) params.append('generation', generationFilter);
      if (statusFilter) params.append('isAlive', statusFilter);

      const res = await fetch(`/api/members?${params.toString()}`);
      const data = await res.json();
      setMembers(data.members || []);
      setBranches(data.branches || []);
    } catch (err) {
      console.error('Failed to load members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [search, branchFilter, generationFilter, statusFilter]);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      courtesyName: '',
      posthumousName: '',
      gender: 'MALE',
      branchId: branches[0]?.id || '',
      generationLevel: 5,
      birthOrder: 1,
      isAlive: true,
      dobSolar: '',
      dobLunarDay: 1,
      dobLunarMonth: 1,
      dobLunarYear: '',
      dodSolar: '',
      dodLunarDay: 1,
      dodLunarMonth: 1,
      dodLunarYear: '',
      burialPlace: '',
      biography: '',
      phone: '',
      email: '',
      currentResidence: '',
      parentIds: [],
      spouseId: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Person) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      courtesyName: member.courtesyName || '',
      posthumousName: member.posthumousName || '',
      gender: member.gender as 'MALE' | 'FEMALE',
      branchId: member.branchId || '',
      generationLevel: member.generationLevel,
      birthOrder: member.birthOrder || 1,
      isAlive: member.isAlive,
      dobSolar: member.dobSolar || '',
      dobLunarDay: member.dobLunarDay || 1,
      dobLunarMonth: member.dobLunarMonth || 1,
      dobLunarYear: member.dobLunarYear || '',
      dodSolar: member.dodSolar || '',
      dodLunarDay: member.dodLunarDay || 1,
      dodLunarMonth: member.dodLunarMonth || 1,
      dodLunarYear: member.dodLunarYear || '',
      burialPlace: member.burialPlace || '',
      biography: member.biography || '',
      phone: member.phone || '',
      email: member.email || '',
      currentResidence: member.currentResidence || '',
      parentIds: member.parentIds || [],
      spouseId: member.spouseIds?.[0] || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // Cập nhật
        await fetch('/api/members', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...formData }),
        });
      } else {
        // Thêm mới
        await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clanId: 'clan-1', ...formData }),
        });
      }
      setIsModalOpen(false);
      loadMembers();
    } catch (err) {
      console.error('Lỗi lưu thành viên', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" khỏi gia phả?`)) {
      try {
        await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
        loadMembers();
      } catch (err) {
        console.error('Lỗi xóa thành viên', err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Button Thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ead8c0] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#341d13] flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-700" />
            Hồ Sơ & Danh Sách Thành Viên
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Tổng hợp toàn bộ con cháu nội ngoại và các bậc tiền nhân trong gia tộc.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          Thêm Thành Viên Mới
        </button>
      </div>

      {/* Thanh Bộ Lọc & Tìm Kiếm */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#ead8c0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tìm kiếm tên */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, tiểu sử..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] text-sm text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Lọc theo Chi */}
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] text-sm text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">-- Tất cả các Chi --</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Lọc theo Đời */}
        <select
          value={generationFilter}
          onChange={(e) => setGenerationFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] text-sm text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">-- Tất cả thế hệ --</option>
          <option value="1">Đời 1 (Thủy Tổ)</option>
          <option value="2">Đời 2</option>
          <option value="3">Đời 3</option>
          <option value="4">Đời 4</option>
          <option value="5">Đời 5</option>
        </select>

        {/* Lọc theo trạng thái sống/mất */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] text-sm text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="true">Còn sống</option>
          <option value="false">Đã tạ thế</option>
        </select>
      </div>

      {/* Danh Sách Thành Viên (Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const isMale = member.gender === 'MALE';
          const branch = branches.find((b) => b.id === member.branchId);

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#ead8c0] hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={member.avatarUrl || (isMale ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150')}
                  alt={member.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-sm flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                      Đời {member.generationLevel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        member.isAlive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {member.isAlive ? 'Còn sống' : 'Đã mất'}
                    </span>
                  </div>

                  <h3 className="font-bold font-serif text-lg text-[#341d13] truncate mt-1">
                    {member.fullName}
                  </h3>

                  {member.courtesyName && (
                    <p className="text-xs text-amber-800/80 italic truncate">
                      Tự: {member.courtesyName}
                    </p>
                  )}

                  <p className="text-xs text-stone-500 mt-0.5 truncate">
                    {branch?.name || 'Chưa phân chi'}
                  </p>
                </div>
              </div>

              {/* Thông tin ngày sinh / mất / liên hệ */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-[#f4ede0] pt-3">
                {member.isAlive ? (
                  <>
                    {member.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.currentResidence && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{member.currentResidence}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-red-900 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      Giỗ: Ngày {member.dodLunarDay || '??'}/{member.dodLunarMonth || '??'} (ÂL)
                    </span>
                  </div>
                )}
              </div>

              {/* Hành động */}
              <div className="flex items-center justify-between border-t border-[#f4ede0] pt-3">
                <button
                  onClick={() => setDetailMember(member)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem Chi Tiết
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-amber-700 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.fullName)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL THÊM / SỬA THÀNH VIÊN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#ead8c0] max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#ead8c0] pb-4">
              <h3 className="text-xl font-bold font-serif text-[#341d13]">
                {editingMember ? 'Chỉnh Sửa Hồ Sơ Thành Viên' : 'Thêm Thành Viên Mới Vào Gia Phả'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="VD: Nguyễn Văn An"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên tự / Tên hiệu
                  </label>
                  <input
                    type="text"
                    value={formData.courtesyName}
                    onChange={(e) => setFormData({ ...formData, courtesyName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="VD: Đức Phủ Quân"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="MALE">Nam (Đinh)</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Thuộc Chi / Phái
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="">-- Chưa phân chi --</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Đời thứ mấy trong gia phả *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={formData.generationLevel}
                    onChange={(e) => setFormData({ ...formData, generationLevel: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Con thứ mấy trong gia đình
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.birthOrder}
                    onChange={(e) => setFormData({ ...formData, birthOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tình trạng sống / mất */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAlive}
                    onChange={(e) => setFormData({ ...formData, isAlive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-xs text-stone-800">Thành viên này còn sống</span>
                </label>
              </div>

              {/* Nếu đã mất: Thông tin ngày giỗ */}
              {!formData.isAlive && (
                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-3">
                  <div className="text-xs font-bold text-red-900 uppercase">
                    Thông tin ngày giỗ & an táng (Âm lịch)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-0.5">Ngày giỗ (ÂL)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.dodLunarDay}
                        onChange={(e) => setFormData({ ...formData, dodLunarDay: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-0.5">Tháng giỗ (ÂL)</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={formData.dodLunarMonth}
                        onChange={(e) => setFormData({ ...formData, dodLunarMonth: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-0.5">Năm mất Can Chi</label>
                      <input
                        type="text"
                        placeholder="VD: Ất Dậu 1945"
                        value={formData.dodLunarYear}
                        onChange={(e) => setFormData({ ...formData, dodLunarYear: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-0.5">Vị trí mộ phần</label>
                    <input
                      type="text"
                      placeholder="VD: Khu Nghĩa trang Dòng họ Tiên Điền"
                      value={formData.burialPlace}
                      onChange={(e) => setFormData({ ...formData, burialPlace: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Tiểu sử & Liên hệ */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiểu sử, Học vấn & Sự nghiệp
                  </label>
                  <textarea
                    rows={3}
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Ghi chú về cuộc đời, chức vụ, huân chương, công đức đóng góp..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Nơi ở hiện nay</label>
                    <input
                      type="text"
                      value={formData.currentResidence}
                      onChange={(e) => setFormData({ ...formData, currentResidence: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                    />
                  </div>
                </div>
              </div>

              {/* Nút lưu */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ead8c0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-md"
                >
                  {editingMember ? 'Lưu Thay Đổi' : 'Thêm Vào Gia Phả'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT */}
      {detailMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ead8c0] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#ead8c0] pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={detailMember.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={detailMember.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#341d13]">{detailMember.fullName}</h3>
                  <div className="text-xs text-stone-500">Đời thứ {detailMember.generationLevel}</div>
                </div>
              </div>
              <button onClick={() => setDetailMember(null)} className="p-2 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-stone-700">
              {detailMember.biography && (
                <div className="p-3 bg-[#fbf7f0] rounded-xl border border-[#ead8c0] text-xs leading-relaxed">
                  {detailMember.biography}
                </div>
              )}
              {detailMember.burialPlace && (
                <div className="flex items-center gap-2 text-xs text-red-900">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Mộ phần: {detailMember.burialPlace}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailMember(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
