import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';

export async function GET() {
  const clan = giaPhaStore.getClan();
  const branches = giaPhaStore.getBranches();
  const persons = giaPhaStore.getPersons();

  return NextResponse.json({
    clan,
    branches,
    stats: {
      totalMembers: persons.length,
      aliveCount: persons.filter((p) => p.isAlive).length,
      deceasedCount: persons.filter((p) => !p.isAlive).length,
      maleCount: persons.filter((p) => p.gender === 'MALE').length,
      femaleCount: persons.filter((p) => p.gender === 'FEMALE').length,
      generationCount: Math.max(...persons.map((p) => p.generationLevel || 1)),
      branchCount: branches.length,
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = giaPhaStore.updateClan(body);
    return NextResponse.json({ success: true, clan: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật thông tin dòng họ' }, { status: 400 });
  }
}
