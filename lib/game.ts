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
  const routes = db.prepare('SELECT route_id as routeId, visited, points, visited_at as visitedAt FROM game_progress ORDER BY route_id').all() as Route[];
  
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
  const route = db.prepare('SELECT * FROM game_progress WHERE route_id = ?').get(routeId) as Route & { id: number };
  
  if (!route) {
    return { success: false, points: 0, error: 'Route not found' };
  }
  
  if (route.visited) {
    return { success: false, points: 0, error: 'Route already visited' };
  }
  
  const now = new Date().toISOString();
  db.prepare('UPDATE game_progress SET visited = 1, visited_at = ? WHERE route_id = ?').run(now, routeId);
  
  return { success: true, points: route.points };
}

export function resetGame(): void {
  db.prepare('UPDATE game_progress SET visited = 0, visited_at = NULL').run();
  db.prepare('DELETE FROM game_state').run();
}

export function getRoutePoints(): { routeId: string; points: number }[] {
  return db.prepare('SELECT route_id as routeId, points FROM game_progress ORDER BY route_id').all() as { routeId: string; points: number }[];
}

