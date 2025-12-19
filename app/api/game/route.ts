import { NextResponse } from 'next/server';
import { getGameState } from '@/lib/game';

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const state = getGameState();
    return NextResponse.json(state);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}

