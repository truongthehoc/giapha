import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');

  let articles = giaPhaStore.getArticles();

  if (slug) {
    const article = giaPhaStore.getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
    }
    return NextResponse.json({ article });
  }

  if (category) {
    articles = articles.filter((a) => a.category === category);
  }

  return NextResponse.json({ articles });
}
