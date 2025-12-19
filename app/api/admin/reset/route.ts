import { NextResponse } from 'next/server';
import { resetGame } from '@/lib/game';

export async function POST() {
  try {
    resetGame();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting game:', error);
    return NextResponse.json({ error: 'Failed to reset game' }, { status: 500 });
  }
}

