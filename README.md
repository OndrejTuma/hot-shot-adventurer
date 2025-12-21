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

## Telegram Notifications

The game can send Telegram notifications when a treasure route is visited. To enable this feature:

### Setup Instructions

1. **Create a Telegram Bot:**
   - Open Telegram and search for [@BotFather](https://t.me/botfather)
   - Send `/newbot` and follow the instructions to create a new bot
   - Save the bot token you receive (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Your Chat ID (Choose one method):**
   
   **Method 1 - Using a helper bot (Easiest):**
   - Open Telegram and search for [@userinfobot](https://t.me/userinfobot) or [@getidsbot](https://t.me/getidsbot)
   - Start a conversation with the bot
   - The bot will immediately reply with your chat ID (look for a number like `123456789`)
   
   **Method 2 - Using your own bot:**
   - Start a conversation with your newly created bot
   - Send any message to your bot (e.g., "Hello")
   - Open your browser and visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
     - Replace `<YOUR_BOT_TOKEN>` with the actual token from BotFather
   - In the JSON response, look for `"chat":{"id":` - the number after `"id":` is your chat ID
   
   **Method 3 - Using @RawDataBot:**
   - Search for [@RawDataBot](https://t.me/RawDataBot) on Telegram
   - Start a conversation - it will show all your Telegram data including your chat ID

3. **Configure Environment Variables:**
   - Create a `.env.local` file in the project root (or add to your existing environment configuration)
   - Add the following variables:
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token_here
     TELEGRAM_CHAT_ID=your_chat_id_here
     ```

4. **For Docker Deployment:**
   - Add the environment variables to your `docker-compose.yml` file:
     ```yaml
     environment:
       - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
       - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
     ```
   - Or create a `.env` file in the project root with the variables

**Note:** If the Telegram credentials are not configured, the application will continue to work normally without sending notifications. The notification system is non-blocking and won't affect the game functionality if it fails.

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

## TODO

- [ ] Initial loader
- [x] Translations
- [x] Notification system
- [ ] Logo
- [ ] Remove clickable handlers on unvisited routes
- [ ] Add helper dialogs after double clicks
- [ ] Confetti animation through the whole page height (scrollable)

## License

MIT

