import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const branchId = searchParams.get('branchId');
  const generation = searchParams.get('generation') ? Number(searchParams.get('generation')) : null;
  const isAlive = searchParams.get('isAlive');

  let persons = giaPhaStore.getPersons();
  const parentChildren = giaPhaStore.getParentChildren();
  const marriages = giaPhaStore.getMarriages();

  // Đính kèm quan hệ cha mẹ, vợ chồng, con cái cho từng người
  const enrichedPersons = persons.map((p) => {
    const parentLinks = parentChildren.filter((pc) => pc.childId === p.id);
    const childLinks = parentChildren.filter((pc) => pc.parentId === p.id);
    const spouseLinks = marriages.filter((m) => m.husbandId === p.id || m.wifeId === p.id);

    return {
      ...p,
      parentIds: parentLinks.map((pc) => pc.parentId),
      childrenIds: childLinks.map((pc) => pc.childId),
      spouseIds: spouseLinks.map((m) => (m.husbandId === p.id ? m.wifeId : m.husbandId)),
    };
  });

  let filtered = enrichedPersons;

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.fullName.toLowerCase().includes(query) ||
        (p.courtesyName && p.courtesyName.toLowerCase().includes(query)) ||
        (p.biography && p.biography.toLowerCase().includes(query))
    );
  }

  if (branchId) {
    filtered = filtered.filter((p) => p.branchId === branchId);
  }

  if (generation) {
    filtered = filtered.filter((p) => p.generationLevel === generation);
  }

  if (isAlive !== null && isAlive !== undefined && isAlive !== '') {
    const aliveBool = isAlive === 'true';
    filtered = filtered.filter((p) => p.isAlive === aliveBool);
  }

  return NextResponse.json({
    members: filtered,
    total: filtered.length,
    branches: giaPhaStore.getBranches(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parentIds, spouseId, ...personData } = body;

    const newPerson = giaPhaStore.addPerson(personData, parentIds || [], spouseId);
    return NextResponse.json({ success: true, member: newPerson }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm thành viên mới' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID thành viên' }, { status: 400 });
    }

    const updated = giaPhaStore.updatePerson(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật thành viên' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID thành viên cần xóa' }, { status: 400 });
    }

    giaPhaStore.deletePerson(id);
    return NextResponse.json({ success: true, message: 'Đã xóa thành viên thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa thành viên' }, { status: 400 });
  }
}
