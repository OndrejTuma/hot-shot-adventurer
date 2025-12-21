import { NextRequest, NextResponse } from 'next/server';
import { visitRoute, getGameState } from '@/lib/game';
import { getRouteById } from '@/lib/routes';
import { sendTelegramNotification, formatRouteVisitNotification } from '@/lib/telegram';

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
    
    // Send Telegram notification (non-blocking, don't fail if it errors)
    const routeConfig = getRouteById(routeId);
    if (routeConfig) {
      const notificationMessage = formatRouteVisitNotification(
        routeConfig.name,
        routeId,
        result.points,
        state.totalPoints,
        state.visitedRoutes,
        state.totalRoutes
      );
      
      // Send notification asynchronously, don't wait for it
      sendTelegramNotification(notificationMessage).catch((error) => {
        console.error('[Visit Route] Failed to send Telegram notification:', error);
      });
    }
    
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

