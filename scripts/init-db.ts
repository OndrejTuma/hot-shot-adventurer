// This script initializes the database if needed
// It's automatically run when the app starts, but can be run manually if needed

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getRoutePointsArray } from '../lib/routes';

const dbPath = path.join(process.cwd(), 'data', 'game.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS game_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id TEXT UNIQUE NOT NULL,
    visited BOOLEAN DEFAULT 0,
    points INTEGER NOT NULL,
    visited_at TEXT
  );

  CREATE TABLE IF NOT EXISTS game_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_route_id ON game_progress(route_id);
`);

// Initialize routes if they don't exist
const routeCount = db.prepare('SELECT COUNT(*) as count FROM game_progress').get() as { count: number };
if (routeCount.count === 0) {
  // Get route data from routes.ts
  const routes = getRoutePointsArray();
  const insert = db.prepare('INSERT INTO game_progress (route_id, points) VALUES (?, ?)');
  
  const insertMany = db.transaction((routes) => {
    for (const route of routes) {
      insert.run(route.routeId, route.points);
    }
  });
  
  insertMany(routes);
  console.log(`Database initialized with ${routes.length} routes`);
} else {
  console.log('Database already initialized');
}

db.close();
