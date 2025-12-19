import { NextRequest, NextResponse } from 'next/server';
import { visitRoute, getGameState } from '@/lib/game';

export async function POST(request: NextRequest) {
  try {
    const { routeId } = await request.json();
    
    if (!routeId) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 });
    }
    
    const result = visitRoute(routeId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    const state = getGameState();
    
    return NextResponse.json({
      success: true,
      points: result.points,
      state,
    });
  } catch (error) {
    console.error('Error visiting route:', error);
    return NextResponse.json({ error: 'Failed to visit route' }, { status: 500 });
  }
}

