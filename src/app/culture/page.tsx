'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Scroll, History, Feather, BookmarkCheck } from 'lucide-react';
import { Article } from '@/lib/types';

export default function CulturePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'TOC_UOC' | 'HISTORY' | 'ORATION'>('TOC_UOC');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to load articles', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const activeArticle = articles.find((a) => a.category === activeTab) || articles[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-700" />
          Kho Tàng Văn Hóa Gia Tộc
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#341d13]">
          Tộc Ước, Lịch Sử & Văn Tế
        </h1>
        <p className="text-sm text-stone-600">
          Lưu giữ những áng văn, quy ước gia phong và trang sử hào hùng của tiền nhân để con cháu muôn đời phụng sự.
        </p>
      </div>

      {/* Tabs chuyển đổi */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-[#ead8c0] inline-flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('TOC_UOC')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'TOC_UOC'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-600 hover:text-amber-800'
            }`}
          >
            <Scroll className="w-4 h-4" />
            10 Điều Tộc Ước
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-600 hover:text-amber-800'
            }`}
          >
            <History className="w-4 h-4" />
            Lược Sử Phát Tích
          </button>

          <button
            onClick={() => setActiveTab('ORATION')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ORATION'
                ? 'bg-amber-700 text-white shadow-md'
                : 'text-stone-600 hover:text-amber-800'
            }`}
          >
            <Feather className="w-4 h-4" />
            Văn Tế & Câu Đối
          </button>
        </div>
      </div>

      {/* NỘI DUNG VĂN TỰ */}
      {activeArticle ? (
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-md border border-[#ead8c0] space-y-6 relative overflow-hidden">
          
          {/* Họa tiết góc truyền thống */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full pointer-events-none opacity-50" />
          
          <div className="border-b border-[#ead8c0] pb-6 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#341d13] text-center">
              {activeArticle.title}
            </h2>
            {activeArticle.author && (
              <p className="text-xs text-center text-amber-800 font-medium italic">
                Soạn thảo / Phụng lục: {activeArticle.author}
              </p>
            )}
          </div>

          <div className="prose prose-amber max-w-none text-stone-800 leading-relaxed font-serif whitespace-pre-line text-sm sm:text-base">
            {activeArticle.content.trim()}
          </div>

          <div className="pt-8 border-t border-[#ead8c0] flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1 text-amber-800 font-medium">
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>Văn bản chính thức lưu truyền trong Tộc</span>
            </div>
            <span>Ngày ban hành: {activeArticle.createdAt}</span>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-stone-500">Đang tải tư liệu...</div>
      )}

    </div>
  );
}
