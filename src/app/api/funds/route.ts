import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';

export async function GET() {
  const funds = giaPhaStore.getFunds();
  const transactions = giaPhaStore.getTransactions();

  const totalBalance = funds.reduce((sum, f) => sum + f.currentBalance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Đính kèm tên quỹ cho giao dịch
  const enrichedTx = transactions.map((t) => {
    const fund = funds.find((f) => f.id === t.fundId);
    return {
      ...t,
      fundName: fund?.name || 'Quỹ chung',
    };
  });

  return NextResponse.json({
    funds,
    transactions: enrichedTx,
    totalBalance,
    totalIncome,
    totalExpense,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTx = giaPhaStore.addTransaction(body);
    return NextResponse.json({ success: true, transaction: newTx }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi ghi nhận giao dịch thu chi quỹ' }, { status: 400 });
  }
}
