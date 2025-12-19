import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// In Next.js standalone builds, process.cwd() might not be /app
// Use an environment variable or fallback to a reliable path
// For Docker containers, prefer /app/data if it exists, otherwise use process.cwd()
let dataDir: string;
if (process.env.DATA_DIR) {
  dataDir = process.env.DATA_DIR;
} else if (fs.existsSync('/app/data')) {
  // Docker container with expected path
  dataDir = '/app/data';
} else {
  // Development or other environments
  dataDir = path.join(process.cwd(), 'data');
}

const dbPath = path.join(dataDir, 'game.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists with proper error handling
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
    console.log(`Created data directory: ${dbDir}`);
  } catch (error) {
    console.error(`Failed to create data directory: ${dbDir}`, error);
    throw new Error(`Cannot create data directory at ${dbDir}: ${error}`);
  }
}

// Verify directory is writable before attempting to create database
try {
  fs.accessSync(dbDir, fs.constants.W_OK);
} catch (error) {
  console.error(`Data directory is not writable: ${dbDir}`);
  console.error('Current user:', process.getuid ? process.getuid() : 'unknown');
  console.error('Directory stats:', fs.statSync ? fs.statSync(dbDir) : 'unavailable');
  throw new Error(`Data directory ${dbDir} is not writable. Check permissions.`);
}

// Create database with error handling
let db: Database.Database;
try {
  db = new Database(dbPath);
  console.log(`Database opened successfully at: ${dbPath}`);
} catch (error) {
  console.error('Failed to open database:', error);
  console.error('Database path:', dbPath);
  console.error('Current working directory:', process.cwd());
  console.error('Data directory:', dataDir);
  console.error('Data directory exists:', fs.existsSync(dbDir));
  console.error('Database file exists:', fs.existsSync(dbPath));
  if (fs.existsSync(dbDir)) {
    try {
      const stats = fs.statSync(dbDir);
      console.error('Directory stats:', {
        mode: stats.mode.toString(8),
        uid: stats.uid,
        gid: stats.gid,
        isDirectory: stats.isDirectory()
      });
    } catch (e) {
      console.error('Could not get directory stats:', e);
    }
  }
  throw error;
}

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
  console.log('[db] Initializing routes - database was empty');
  const { getRoutePointsArray } = require('./routes');
  const routes = getRoutePointsArray();
  const insert = db.prepare('INSERT INTO game_progress (route_id, points) VALUES (?, ?)');
  
  const insertMany = db.transaction((routes) => {
    for (const route of routes) {
      insert.run(route.routeId, route.points);
    }
  });
  
  insertMany(routes);
  console.log(`[db] Initialized ${routes.length} routes`);
} else {
  // Log current state for debugging
  const sample = db.prepare('SELECT route_id, visited, visited_at FROM game_progress LIMIT 3').all();
  console.log(`[db] Database already has ${routeCount.count} routes. Sample:`, sample);
}

export default db;

