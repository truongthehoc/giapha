'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  X, 
  ExternalLink,
  Sparkles,
  GitFork
} from 'lucide-react';
import { TreeNode, TreeLink, MarriageLink } from '@/lib/tree-layout';
import { Branch, Person } from '@/lib/types';
import { toPng } from 'html-to-image';

export default function TreePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [links, setLinks] = useState<TreeLink[]>([]);
  const [marriageLinks, setMarriageLinks] = useState<MarriageLink[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  // Zoom & Pan state
  const [scale, setScale] = useState(0.85);
  const [position, setPosition] = useState({ x: 700, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const viewportRef = useRef<HTMLDivElement>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const centerTree = (targetScale?: number) => {
    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      setPosition({
        x: rect.width / 2,
        y: 60,
      });
      if (targetScale !== undefined) {
        setScale(targetScale);
      }
    } else if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth / 2,
        y: 60,
      });
      if (targetScale !== undefined) {
        setScale(targetScale);
      }
    }
  };

  // Fetch Tree Data
  const loadTree = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branchId', selectedBranch);
      if (selectedGeneration) params.append('generation', selectedGeneration);

      const res = await fetch(`/api/tree?${params.toString()}`);
      const data = await res.json();
      setNodes(data.layout.nodes);
      setLinks(data.layout.links);
      setMarriageLinks(data.layout.marriageLinks || []);
      setBranches(data.branches);
      setTimeout(() => {
        centerTree(0.85);
      }, 50);
    } catch (err) {
      console.error('Failed to load tree layout', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();

    const handleResize = () => {
      centerTree();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedBranch, selectedGeneration]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Chỉ chuột trái
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.3), 2.5));
  };

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(s + 0.15, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.3));
  const resetView = () => {
    centerTree(0.85);
  };

  // Xuất file ảnh PNG
  const exportTreeImage = async () => {
    if (!treeContainerRef.current) return;
    try {
      const dataUrl = await toPng(treeContainerRef.current, { backgroundColor: '#fbf7f0' });
      const link = document.createElement('a');
      link.download = `pha-do-nguyen-toc-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi khi xuất ảnh phả đồ', err);
    }
  };

  // Lọc theo tìm kiếm
  const filteredNodes = searchQuery
    ? nodes.filter((n) => n.person.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodes;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#fbf7f0] select-none overflow-hidden relative">
      
      {/* 1. TOP TOOLBAR / BỘ LỌC */}
      <div className="bg-white border-b border-[#ead8c0] px-4 py-3 shadow-sm z-30 flex flex-wrap items-center justify-between gap-3">
        
        {/* Tiêu đề & Bộ lọc */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-[#ead8c0]">
            <GitFork className="w-5 h-5 text-amber-700" />
            <span className="font-serif font-bold text-base text-[#341d13] hidden sm:inline">
              Phả Đồ Trực Quan
            </span>
          </div>

          {/* Lọc theo Chi */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#ddbd9b] bg-[#fbf7f0] text-xs sm:text-sm font-medium text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#ddbd9b] bg-[#fbf7f0] text-xs sm:text-sm font-medium text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">-- Tất cả thế hệ --</option>
            <option value="1">Đời 1 (Thủy Tổ)</option>
            <option value="2">Đời 2</option>
            <option value="3">Đời 3</option>
            <option value="4">Đời 4</option>
            <option value="5">Đời 5</option>
          </select>

          {/* Tìm kiếm nhanh */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm tên người trong phả đồ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-48 sm:w-64 rounded-lg border border-[#ddbd9b] bg-[#fbf7f0] text-xs sm:text-sm text-[#341d13] focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Nút Phóng to / Thu nhỏ & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-[#fbf7f0] border border-[#ddbd9b] rounded-lg p-1 flex items-center space-x-1">
            <button
              onClick={zoomIn}
              title="Phóng to"
              className="p-1.5 rounded hover:bg-white text-stone-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              title="Thu nhỏ"
              className="p-1.5 rounded hover:bg-white text-stone-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              title="Căn giữa phả đồ"
              className="p-1.5 rounded hover:bg-white text-stone-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={exportTreeImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-amber-50 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất Ảnh In Ấn</span>
          </button>
        </div>
      </div>

      {/* 2. TREE CANVAS CONTAINER */}
      <div
        ref={viewportRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden pattern-bg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          ref={treeContainerRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="absolute left-0 top-0 pointer-events-auto"
        >
          {/* SVG Links (Đường nối Cha/Mẹ -> Con) */}
          <svg
            ref={svgRef}
            className="absolute left-0 top-0 overflow-visible pointer-events-none"
            style={{ width: '4000px', height: '3000px' }}
          >
            <defs>
              {/* Gradient Nhánh Nam (Nhánh Đinh / Chính - Màu Đỏ) */}
              <linearGradient id="maleLinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.95" />
              </linearGradient>

              {/* Gradient Hôn Nhân (Vợ - Chồng - Màu Hồng Son / Rose Coral) */}
              <linearGradient id="marriageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* 1. Đường nối Hôn Nhân (Vợ - Chồng) */}
            {marriageLinks.map((mLink) => {
              return (
                <g key={mLink.id}>
                  {/* Đường nối ngang nét đứt sang trọng */}
                  <line
                    x1={mLink.sourceX}
                    y1={mLink.sourceY}
                    x2={mLink.targetX}
                    y2={mLink.targetY}
                    stroke="url(#marriageGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  {/* Biểu tượng Trái Tim Hôn Nhân ở điểm giữa */}
                  <circle
                    cx={mLink.midX}
                    cy={mLink.midY}
                    r="12"
                    fill="#fff1f2"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    className="shadow-sm"
                  />
                  <text
                    x={mLink.midX}
                    y={mLink.midY + 4}
                    textAnchor="middle"
                    fill="#e11d48"
                    fontSize="13"
                    fontWeight="bold"
                    className="select-none"
                  >
                    ♥
                  </text>
                </g>
              );
            })}

            {/* 2. Đường nối Cha/Mẹ -> Con */}
            {links.map((link) => {
              // Đường cong trực giao mượt
              const deltaY = link.targetY - link.sourceY;
              const midY = link.sourceY + deltaY / 2;
              const pathD = `M ${link.sourceX} ${link.sourceY} C ${link.sourceX} ${midY}, ${link.targetX} ${midY}, ${link.targetX} ${link.targetY}`;
              
              const isFemaleBranch = link.childGender === 'FEMALE';

              return (
                <path
                  key={link.id}
                  d={pathD}
                  fill="none"
                  stroke={isFemaleBranch ? 'url(#femaleLinkGradient)' : 'url(#maleLinkGradient)'}
                  strokeWidth={isFemaleBranch ? '2.5' : '3'}
                  strokeDasharray={isFemaleBranch ? '4 2' : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* HTML Nodes (Thẻ thành viên) */}
          {filteredNodes.map((node) => {
            const isMale = node.person.gender === 'MALE';
            const isHighlight = searchQuery && node.person.fullName.toLowerCase().includes(searchQuery.toLowerCase());

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPerson(node.person);
                }}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                }}
                className={`group rounded-2xl p-3 cursor-pointer shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 ${
                  isHighlight
                    ? 'ring-4 ring-amber-500 bg-amber-50 border-amber-600'
                    : isMale
                    ? 'bg-gradient-to-br from-white to-amber-50/50 border-[#cfa074] hover:border-amber-600'
                    : 'bg-gradient-to-br from-white to-rose-50/50 border-[#ead8c0] hover:border-rose-400'
                }`}
              >
                <div className="flex items-center gap-3 h-full">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={node.person.avatarUrl || (isMale ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150')}
                      alt={node.person.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40 shadow-sm"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        node.person.isAlive ? 'bg-emerald-500' : 'bg-stone-500'
                      }`}
                      title={node.person.isAlive ? 'Còn sống' : 'Đã mất'}
                    />
                  </div>

                  {/* Thông tin chính */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900">
                          Đời {node.generation}
                        </span>
                        {node.branchName && (
                          <span className="text-[9px] text-stone-500 truncate max-w-[80px]">
                            {node.branchName.split('(')[0]}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#341d13] font-serif truncate mt-1 group-hover:text-amber-700 transition-colors">
                        {node.person.fullName}
                      </h4>

                      {node.person.courtesyName && (
                        <p className="text-[11px] text-amber-800/80 italic truncate">
                          Tự: {node.person.courtesyName}
                        </p>
                      )}
                    </div>

                    {/* Vợ / Chồng & Năm sinh-mất */}
                    <div className="text-[10px] text-stone-500 flex items-center justify-between border-t border-[#ead8c0]/60 pt-1">
                      <span>
                        {node.person.dobLunarYear ? node.person.dobLunarYear.split(' ')[0] : (node.person.dobSolar ? node.person.dobSolar.slice(0, 4) : '—')}
                        {' - '}
                        {node.person.isAlive ? 'Nay' : (node.person.dodLunarYear ? node.person.dodLunarYear.split(' ')[0] : 'Mất')}
                      </span>

                      {node.spouses.length > 0 && (
                        <span className="text-amber-700 font-medium truncate max-w-[90px]">
                          ♥ {node.spouses[0].fullName.split(' ').slice(-1)[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Legend Chú Thích Đường Dẫn */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[#ead8c0] text-xs space-y-2 pointer-events-auto">
          <div className="font-bold text-[#341d13] text-[11px] uppercase tracking-wider">
            Quy Ước Đường Dẫn Phả Đồ:
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 bg-red-600 rounded-full inline-block shadow-sm" />
            <span className="font-semibold text-red-900">Nhánh Nam (Nhánh Đinh / Chính)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 border-t-2 border-dashed border-sky-500 inline-block" />
            <span className="font-semibold text-sky-800">Nhánh Nữ (Nhánh Ngoại)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 border-t-2 border-dashed border-rose-500 inline-block" />
            <span className="font-semibold text-rose-700">♥ Liên Kết Hôn Nhân (Vợ - Chồng)</span>
          </div>
        </div>
      </div>

      {/* 3. MODAL XEM CHI TIẾT THÀNH VIÊN */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ead8c0] space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-[#ead8c0] pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPerson.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={selectedPerson.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      Đời thứ {selectedPerson.generationLevel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        selectedPerson.isAlive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {selectedPerson.isAlive ? 'Còn sống' : 'Đã tạ thế'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-[#341d13] mt-1">
                    {selectedPerson.fullName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPerson(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chi tiết thông tin */}
            <div className="space-y-3 text-sm text-stone-700 max-h-[60vh] overflow-y-auto pr-2">
              {selectedPerson.courtesyName && (
                <div className="flex items-center justify-between py-1 border-b border-[#f4ede0]">
                  <span className="text-stone-500">Tên tự / Tên hiệu:</span>
                  <span className="font-semibold text-[#341d13]">{selectedPerson.courtesyName}</span>
                </div>
              )}

              {selectedPerson.posthumousName && (
                <div className="flex items-center justify-between py-1 border-b border-[#f4ede0]">
                  <span className="text-stone-500">Tên thụy (Tên hèm cúng bái):</span>
                  <span className="font-semibold text-amber-800">{selectedPerson.posthumousName}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1 border-b border-[#f4ede0]">
                <span className="text-stone-500">Giới tính:</span>
                <span className="font-semibold">
                  {selectedPerson.gender === 'MALE' ? 'Nam (Đinh)' : 'Nữ'}
                </span>
              </div>

              {/* Ngày sinh */}
              <div className="flex items-center justify-between py-1 border-b border-[#f4ede0]">
                <span className="text-stone-500">Ngày sinh Âm Lịch:</span>
                <span className="font-semibold">
                  {selectedPerson.dobLunarDay ? `Ngày ${selectedPerson.dobLunarDay}/${selectedPerson.dobLunarMonth}` : ''}{' '}
                  {selectedPerson.dobLunarYear || 'Chưa rõ'}
                </span>
              </div>

              {/* Ngày mất / Giỗ chạp */}
              {!selectedPerson.isAlive && (
                <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 space-y-1">
                  <div className="text-xs font-bold uppercase text-red-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Thông Tin Ngày Giỗ & Mộ Phần
                  </div>
                  <div className="text-sm text-red-950 font-medium">
                    Ngày Giỗ (ÂL): Ngày {selectedPerson.dodLunarDay || '??'} tháng {selectedPerson.dodLunarMonth || '??'}{' '}
                    {selectedPerson.dodLunarYear ? `(${selectedPerson.dodLunarYear})` : ''}
                  </div>
                  {selectedPerson.burialPlace && (
                    <div className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      Mộ phần: {selectedPerson.burialPlace}
                    </div>
                  )}
                </div>
              )}

              {/* Tiểu sử & Công trạng */}
              {selectedPerson.biography && (
                <div className="pt-2 space-y-1">
                  <span className="text-xs font-bold uppercase text-stone-500">Tiểu sử & Sự nghiệp:</span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#fbf7f0] p-3 rounded-xl border border-[#ead8c0]">
                    {selectedPerson.biography}
                  </p>
                </div>
              )}

              {/* Liên hệ nếu còn sống */}
              {selectedPerson.isAlive && (selectedPerson.phone || selectedPerson.currentResidence) && (
                <div className="pt-2 space-y-1.5 text-xs text-stone-600">
                  {selectedPerson.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Điện thoại: {selectedPerson.phone}</span>
                    </div>
                  )}
                  {selectedPerson.currentResidence && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Nơi ở: {selectedPerson.currentResidence}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="pt-3 border-t border-[#ead8c0] flex justify-end">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-100 font-semibold text-sm hover:bg-stone-800 transition-colors"
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
