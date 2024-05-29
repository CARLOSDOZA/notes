#!/bin/bash

set -e

# Verificación e instalación de Go 1.22.2 si no está instalado
echo "Verificando la instalación de Go..."

if ! command -v go &> /dev/null; then
  echo "Go no encontrado. Instalando Go 1.22.2..."
  wget -q https://golang.org/dl/go1.22.2.linux-amd64.tar.gz
  sudo tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz
  rm go1.22.2.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
fi

echo "Versión de Go:"
go version

# Verificación e instalación de Node.js v18.16.0 si no está instalado
echo "Verificando la instalación de Node.js..."

if ! command -v node &> /dev/null; then
  echo "Node.js no encontrado. Instalando Node.js v18.16.0..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "Versión de Node.js:"
node --version
npm --version

# Asegurarse de que MySQL esté instalado y en funcionamiento
echo "Verificando la instalación de MySQL..."

if ! command -v mysql &> /dev/null; then
  echo "MySQL no encontrado. Instalando MySQL..."
  sudo apt install -y mysql-server
  sudo systemctl start mysql
  sudo systemctl enable mysql
fi

# Verificar el estado de MySQL y asegurarse de que esté en ejecución
echo "Verificando el estado del servicio MySQL..."
if ! systemctl is-active --quiet mysql; then
  echo "El servicio MySQL no está en ejecución. Iniciando MySQL..."
  sudo systemctl start mysql
else
  echo "El servicio MySQL está en ejecución."
fi

echo "Verificando la configuración de enlace del servidor MySQL..."
sudo sed -i 's/^bind-address\s*=.*/bind-address = 127.0.0.1/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# Asegurarse de que el usuario y la base de datos MySQL existan
echo "Asegurando que el usuario y la base de datos MySQL existan..."
MYSQL_USER="root"
MYSQL_DATABASE="notes"

# Crear la base de datos si no existe
sudo mysql -u${MYSQL_USER} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
# Asignar privilegios al usuario
sudo mysql -u${MYSQL_USER} -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'localhost';"
sudo mysql -u${MYSQL_USER} -e "FLUSH PRIVILEGES;"
sudo mysql -u${MYSQL_USER} -e "USE mysql;"
sudo mysql -u${MYSQL_USER} -e "UPDATE user SET plugin='mysql_native_password' WHERE User='root';"
sudo service mysql restart

# Crear el archivo .env si no existe
if [ ! -f backend/.env ]; then
  echo "Creando el archivo .env..."
  cat <<EOT >> backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=notes

ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009
EOT
  echo "Archivo .env creado exitosamente."
fi

# Exportar variables de entorno
export $(grep -v '^#' backend/.env | xargs)

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd backend
go mod tidy

# Configurar la base de datos
echo "Configurando la base de datos..."
go run main.go migrate

# Instalar dependencias del frontend
echo "Instalando dependencias del frontend..."
cd ../frontend
npm install

# Compilar el frontend
echo "Compilando el frontend..."
npm run build

# Iniciar servidor backend
echo "Iniciando el servidor backend..."
cd ../backend
go run main.go &

# Iniciar servidor frontend
echo "Iniciando el servidor frontend..."
cd ../frontend
npm run dev &

echo "Aplicación iniciada correctamente. Backend ejecutándose en el puerto 8000 y frontend en el puerto 5173."
