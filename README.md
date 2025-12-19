# Hot Shot Adventurer 🏺

An interactive treasure hunting game inspired by Indiana Jones! Embark on an adventure to discover 8 hidden locations and collect 5,000 coins.

## Features

- 🗺️ Interactive map with 8 unique locations
- 🪙 Progress tracking with animated coin collection
- 🎉 Celebration animations when discovering locations
- 🏆 Completion screen with prize claiming countdown
- 🎮 Admin panel for monitoring and resetting game progress
- 💾 Persistent progress storage with SQLite

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Styling**: CSS-in-JS with inline styles
- **Animations**: react-confetti
- **Containerization**: Docker & Docker Compose

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production with Docker

1. Build and start the application:
```bash
make production
```

Or manually:
```bash
docker-compose build
docker-compose up -d
```

2. Access the application at [http://localhost:3000](http://localhost:3000)

### Makefile Commands

- `make up` - Start the application
- `make build` - Build Docker image
- `make down` - Stop the application
- `make restart` - Restart the application
- `make logs` - View application logs
- `make clean` - Clean up containers and database
- `make dev` - Run in development mode (requires local Node.js)
- `make production` - Full production setup

## Game Routes

The game consists of 8 unique routes, each with a specific point value:

1. `/route/ancient-temple-ruins` - 800 points
2. `/route/forbidden-crystal-cave` - 700 points
3. `/route/lost-city-of-gold` - 650 points
4. `/route/mysterious-jungle-path` - 650 points
5. `/route/hidden-treasure-vault` - 600 points
6. `/route/sacred-mountain-peak` - 600 points
7. `/route/desert-oasis-secret` - 550 points
8. `/route/underwater-archaeological-site` - 450 points

**Total: 5,000 points**

## Admin Panel

Access the admin panel at `/admin` to:
- View game statistics and progress
- See detailed route information
- Reset the game to start fresh

## Database

The game uses SQLite for persistent storage. The database file is stored in the `data/` directory and is automatically initialized on first run.

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin panel
│   ├── route/        # Game route pages
│   └── page.tsx      # Main game page
├── components/       # React components
├── lib/              # Database and game logic
├── data/             # SQLite database (gitignored)
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── Makefile          # Build and deployment commands
```

## License

MIT

