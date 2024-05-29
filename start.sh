#!/bin/bash

set -e

# Check and install Go 1.22.2 if not installed
echo "Checking Go installation..."

if ! command -v go &> /dev/null; then
  echo "Go not found. Installing Go 1.22.2..."
  wget -q https://golang.org/dl/go1.22.2.linux-amd64.tar.gz
  sudo tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz
  rm go1.22.2.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
fi

echo "Go version:"
go version

# Check and install Node.js v18.16.0 if not installed
echo "Checking Node.js installation..."

if ! command -v node &> /dev/null; then
  echo "Node.js not found. Installing Node.js v18.16.0..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "Node.js version:"
node --version
npm --version

# Ensure MySQL is installed and running
echo "Checking for MySQL installation..."

if ! command -v mysql &> /dev/null; then
  echo "MySQL not found. Installing MySQL..."
  sudo apt update
  sudo apt install -y mysql-server
  sudo systemctl start mysql
  sudo systemctl enable mysql
fi

echo "Verifying MySQL service status..."
sudo systemctl status mysql || {
  echo "MySQL service is not running. Starting MySQL..."
  sudo systemctl start mysql
}

echo "Checking MySQL server binding..."
sudo sed -i 's/^bind-address\s*=.*/bind-address = 127.0.0.1/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# Ensure the MySQL user and database exist
echo "Ensuring the MySQL user and database exist..."
MYSQL_USER="root"
MYSQL_PASSWORD="yourpassword"
MYSQL_DATABASE="mydatabase"

mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';"
mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "FLUSH PRIVILEGES;"

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
  echo "Creating .env file..."
  cat <<EOT >> backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mydatabase

ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009
EOT
  echo ".env file created successfully."
fi

# Export environment variables
export $(grep -v '^#' backend/.env | xargs)

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
go mod tidy

# Set up the database
echo "Setting up database..."
go run main.go migrate

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Start backend server
echo "Starting backend server..."
cd ../backend
go run main.go &

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &

echo "Application started successfully. Backend running on port 8000 and frontend running on port 5173."
