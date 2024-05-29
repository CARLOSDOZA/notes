
set -e

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


export $(grep -v '^#' backend/.env | xargs)


echo "Installing backend dependencies..."
cd backend
go mod tidy


echo "Setting up database..."
go run main.go migrate


echo "Installing frontend dependencies..."
cd ../frontend
npm install


echo "Building frontend..."
npm run build


echo "Starting backend server..."
cd ../backend
go run main.go &

echo "Starting frontend server..."
cd ../frontend
npm run dev &

echo "Application started successfully. Backend running on port 8000 and frontend running on port 5173."
