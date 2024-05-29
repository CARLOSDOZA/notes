#!/bin/bash

# Stop on first error
set -e

# Check if .env file exists in the backend directory, if not, create one
if [ ! -f backend/.env ]; then
  echo "Creating .env file..."
  cat <<EOT >> backend/.env
# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mydatabase

# Default Admin User
ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009
EOT
  echo ".env file created successfully."
fi

# Load environment variables
export $(cat backend/.env | xargs)

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
go mod tidy

# Set up database schema
echo "Setting up database..."
go run main.go migrate

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Run backend and frontend
echo "Starting backend server..."
cd ../backend
go run main.go &

echo "Starting frontend server..."
cd ../frontend
npm run dev &

echo "Application started successfully. Backend running on port 8000 and frontend running on port 5173."
