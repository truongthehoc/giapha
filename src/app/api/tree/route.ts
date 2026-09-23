import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';
import { buildFamilyTreeLayout } from '@/lib/tree-layout';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get('branchId');
  const generation = searchParams.get('generation') ? Number(searchParams.get('generation')) : null;

  const persons = giaPhaStore.getPersons();
  const parentChildren = giaPhaStore.getParentChildren();
  const marriages = giaPhaStore.getMarriages();
  const branches = giaPhaStore.getBranches();

  const layout = buildFamilyTreeLayout(persons, parentChildren, marriages, branches, branchId, generation);

  return NextResponse.json({
    clan: giaPhaStore.getClan(),
    branches: branches,
    layout,
    totalMembers: persons.length,
    totalAlive: persons.filter((p) => p.isAlive).length,
    totalDeceased: persons.filter((p) => !p.isAlive).length,
  });
}
