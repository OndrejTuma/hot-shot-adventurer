import db from './db';

export interface Route {
  routeId: string;
  visited: boolean;
  points: number;
  visitedAt: string | null;
}

export interface GameState {
  totalPoints: number;
  visitedRoutes: number;
  totalRoutes: number;
  routes: Route[];
  completed: boolean;
}

export function getGameState(): GameState {
  // SQLite returns booleans as integers (0/1), so we need to convert them
  const rawRoutes = db.prepare('SELECT route_id as routeId, visited, points, visited_at as visitedAt FROM game_progress ORDER BY route_id').all() as any[];
  
  // Debug: log first few routes to see what we're getting
  if (rawRoutes.length > 0) {
    console.log('[getGameState] Raw data sample:', JSON.stringify(rawRoutes.slice(0, 3).map(r => ({ routeId: r.routeId, visited: r.visited, visitedType: typeof r.visited }))));
  }
  
  // Convert SQLite integer booleans (0/1) to actual booleans
  // SQLite stores booleans as INTEGER, so visited will be 0 or 1 (number)
  const routes: Route[] = rawRoutes.map(r => {
    const visitedBool = Boolean(r.visited);
    return {
      routeId: r.routeId,
      visited: visitedBool, // Convert 0/1 to false/true - Boolean(0) = false, Boolean(1) = true
      points: r.points,
      visitedAt: r.visitedAt,
    };
  });
  
  const visitedCount = routes.filter(r => r.visited).length;
  console.log(`[getGameState] Converted ${visitedCount} of ${routes.length} routes as visited`);
  
  const totalPoints = routes
    .filter(r => r.visited)
    .reduce((sum, r) => sum + r.points, 0);
  
  const visitedRoutes = routes.filter(r => r.visited).length;
  const completed = visitedRoutes === routes.length;
  
  return {
    totalPoints,
    visitedRoutes,
    totalRoutes: routes.length,
    routes,
    completed,
  };
}

export function visitRoute(routeId: string): { success: boolean; points: number; error?: string } {
  const route = db.prepare('SELECT * FROM game_progress WHERE route_id = ?').get(routeId) as any;
  
  if (!route) {
    return { success: false, points: 0, error: 'Route not found' };
  }
  
  // Check if already visited (SQLite returns 0/1 as integers)
  const isVisited = route.visited === 1 || route.visited === true;
  if (isVisited) {
    return { success: false, points: 0, error: 'Route already visited' };
  }
  
  const now = new Date().toISOString();
  const result = db.prepare('UPDATE game_progress SET visited = 1, visited_at = ? WHERE route_id = ?').run(now, routeId);
  
  // Verify the update was successful
  if (result.changes === 0) {
    console.error(`[visitRoute] Update failed for route ${routeId}: no rows affected`);
    return { success: false, points: 0, error: 'Failed to update route' };
  }
  
  // Verify the update persisted
  const updated = db.prepare('SELECT visited, visited_at FROM game_progress WHERE route_id = ?').get(routeId) as any;
  if (!updated || updated.visited !== 1) {
    console.error(`[visitRoute] Update verification failed for route ${routeId}: visited=${updated?.visited}`);
  }
  
  return { success: true, points: route.points };
}

export function resetGame(): void {
  db.prepare('UPDATE game_progress SET visited = 0, visited_at = NULL').run();
  db.prepare('DELETE FROM game_state').run();
}

export function getRoutePoints(): { routeId: string; points: number }[] {
  return db.prepare('SELECT route_id as routeId, points FROM game_progress ORDER BY route_id').all() as { routeId: string; points: number }[];
}

