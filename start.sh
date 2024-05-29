set -e

# Limpiar y actualizar los repositorios
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*
sudo apt-get update

# Importar la clave GPG de AdoptOpenJDK
curl -sSL https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | sudo apt-key add -

# Actualizar los repositorios nuevamente
sudo apt-get update

# Verificar la instalación de Go y Node.js
echo "Verifying Go installation..."
go version

echo "Verifying Node.js installation..."
node --version

# Crear archivo .env si no existe
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

# Exportar variables de entorno del archivo .env
export $(grep -v '^#' backend/.env | xargs)

# Instalar dependencias del backend
echo "Installing backend dependencies..."
cd backend
go mod tidy

# Configurar la base de datos
echo "Setting up database..."
go run main.go migrate

# Instalar dependencias del frontend
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Construir la aplicación frontend
echo "Building frontend..."
npm run build

# Iniciar el servidor backend
echo "Starting backend server..."
cd ../backend
go run main.go &

# Iniciar el servidor frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &

echo "Application started successfully. Backend running on port 8000 and frontend running on port 5173."
