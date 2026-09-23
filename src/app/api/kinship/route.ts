import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';
import { calculateKinship } from '@/lib/kinship';

export async function POST(request: Request) {
  try {
    const { personAId, personBId } = await request.json();

    if (!personAId || !personBId) {
      return NextResponse.json({ error: 'Vui lòng chọn đủ 2 người cần tra cứu quan hệ' }, { status: 400 });
    }

    const persons = giaPhaStore.getPersons();
    const parentChildren = giaPhaStore.getParentChildren();
    const marriages = giaPhaStore.getMarriages();

    const result = calculateKinship(personAId, personBId, persons, parentChildren, marriages);

    if (!result) {
      return NextResponse.json({ error: 'Không thể xác định quan hệ giữa 2 người này' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi tính toán xưng hô họ hàng' }, { status: 500 });
  }
}
