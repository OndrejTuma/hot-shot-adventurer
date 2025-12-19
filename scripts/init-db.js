// This script initializes the database if needed
// It's automatically run when the app starts, but can be run manually if needed

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

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
const routeCount = db.prepare('SELECT COUNT(*) as count FROM game_progress').get();
if (routeCount.count === 0) {
  // Generate 8 unique route IDs and assign points (total 5000)
  const points = [800, 700, 650, 650, 600, 600, 550, 450]; // Total: 5000
  const insert = db.prepare('INSERT INTO game_progress (route_id, points) VALUES (?, ?)');
  
  const routeIds = [
    'ancient-temple-ruins',
    'forbidden-crystal-cave',
    'lost-city-of-gold',
    'mysterious-jungle-path',
    'hidden-treasure-vault',
    'sacred-mountain-peak',
    'desert-oasis-secret',
    'underwater-archaeological-site'
  ];
  
  const insertMany = db.transaction((routes) => {
    for (let i = 0; i < routes.length; i++) {
      insert.run(routes[i], points[i]);
    }
  });
  
  insertMany(routeIds);
  console.log('Database initialized with 8 routes');
} else {
  console.log('Database already initialized');
}

db.close();

