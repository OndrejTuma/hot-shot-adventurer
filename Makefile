.PHONY: build up down restart logs clean dev

# Build and start the application in production
up:
	docker-compose up -d

# Build the Docker image
build:
	docker-compose build

# Stop the application
down:
	docker-compose down

# Restart the application
restart: down up

# View logs
logs:
	docker-compose logs -f

# Clean up containers and volumes
clean:
	docker-compose down -v
	rm -rf data/*.db data/*.db-journal

# Run in development mode (requires local Node.js)
dev:
	npm install
	npm run dev

# Full production setup
production: build up
	@echo "Application is running at http://localhost:3000"

