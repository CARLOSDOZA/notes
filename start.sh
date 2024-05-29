#!/bin/bash

set -e

# Función para verificar la instalación de un paquete y, si no está instalado, instalarlo
check_install_package() {
  if ! command -v $1 &> /dev/null; then
    echo "$1 no encontrado. Instalando $1..."
    sudo apt update
    sudo apt install -y $2
  fi
}

# Instalación de dependencias
echo "Instalando dependencias necesarias..."

# Instalar Go si no está instalado
check_install_package go golang-go

# Instalar Node.js y npm si no están instalados
check_install_package nodejs nodejs
check_install_package npm npm

# Instalar MySQL si no está instalado
check_install_package mysql mysql-server

# Iniciar MySQL y asegurarse de que esté en ejecución
echo "Verificando el estado del servicio MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar MySQL
echo "Configurando MySQL..."
sudo mysql_secure_installation <<EOF

n
y
y
y
y
EOF

# Crear la base de datos y el usuario MySQL
echo "Creando la base de datos y el usuario MySQL..."
MYSQL_USER="root"
MYSQL_PASSWORD="yourpassword"
MYSQL_DATABASE="mydatabase"

sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';"
sudo mysql -u root -e "FLUSH PRIVILEGES;"

# Crear el archivo de configuración .env si no existe
if [ ! -f backend/.env ]; then
  echo "Creando el archivo .env..."
  cat <<EOT >> backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mydatabase

ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009
EOT
  echo "Archivo .env creado exitosamente."
fi

# Exportar variables de entorno
export $(grep -v '^#' backend/.env | xargs)

# Instalar dependencias del backend y configurar la base de datos
echo "Instalando dependencias del backend y configurando la base de datos..."
cd backend
go mod tidy
go run main.go migrate

# Instalar dependencias del frontend
echo "Instalando dependencias del frontend..."
cd ../frontend
npm install

# Compilar el frontend
echo "Compilando el frontend..."
npm run build

# Iniciar la aplicación
echo "Iniciando la aplicación..."
cd ../backend
go run main.go &

echo "Aplicación iniciada correctamente."
