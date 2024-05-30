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
  echo "Node.js not found. Installing Node.js..."
  sudo apt-get install -y nodejs
fi

# Check and install npm 8.19.3
echo "Checking npm installation..."

if ! command -v npm &> /dev/null; then
  echo "npm not found. Installing npm 8.19.3..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  source ~/.nvm/nvm.sh
  nvm install 18
  nvm use 18
fi

echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# Ensure MySQL is installed and running
echo "Checking MySQL installation..."

if ! command -v mysql &> /dev/null; then
  echo "MySQL not found. Installing MySQL..."
  sudo apt install -y mysql-server
  sudo systemctl start mysql
  sudo systemctl enable mysql
fi

# Check MySQL service status and ensure it is running
echo "Checking MySQL service status..."
if ! systemctl is-active --quiet mysql; then
  echo "MySQL service is not running. Starting MySQL..."
  sudo systemctl start mysql
else
  echo "MySQL service is running."
fi

echo "Checking MySQL server bind address configuration..."
sudo sed -i 's/^bind-address\s*=.*/bind-address = 127.0.0.1/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# Ensure MySQL user and database exist
echo "Ensuring MySQL user and database exist..."
MYSQL_USER="root"
MYSQL_DATABASE="notes"

# Create the database if it does not exist and select it
sudo mysql -u${MYSQL_USER} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}; USE ${MYSQL_DATABASE};"
# Grant privileges to the user on the selected database
sudo mysql -u${MYSQL_USER} -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost';"
sudo mysql -u${MYSQL_USER} -e "FLUSH PRIVILEGES;"

# Update the authentication plugin if necessary
sudo mysql -u${MYSQL_USER} -e "UPDATE mysql.user SET plugin='mysql_native_password' WHERE User='root';"
# Restart the MySQL service to apply changes
sudo service mysql restart

# Create the .env file if it does not exist
if [ ! -f backend/.env ]; then
  echo "Creating the .env file..."
  cat <<EOT >> backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=notes

ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009

TOKEN_TTL="1800"
JWT_PRIVATE_KEY="2k18c3Cco1^q"
EOT
  echo ".env file created successfully."
fi

# Export environment variables
export $(grep -v '^#' backend/.env | xargs)

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
go mod tidy

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Build the frontend
echo "Building the frontend..."
npm run build

# Start backend server
echo "Starting backend server..."
cd ../backend
go run main.go &

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &

echo "Application started successfully. Backend running on port 8000 and frontend on port 5173."
