# Backend and Frontend Project

## Description
This project consists of a simple web application that allows user to take notes, tag, and filter them.

# README

## Backend (Go)

### Requirements

- Go 1.22.2
- gorm.io/driver/mysql v1.5.6
- github.com/gin-contrib/cors v1.7.2
- github.com/gin-gonic/gin v1.10.0
- github.com/go-sql-driver/mysql v1.7.0
- github.com/golang-jwt/jwt/v5 v5.2.1
- github.com/jinzhu/gorm v1.9.16
- github.com/joho/godotenv v1.5.1
- golang.org/x/crypto v0.23.0
- gorm.io/gorm v1.25.10

### Additional Dependencies

- github.com/bytedance/sonic v1.11.6
- github.com/bytedance/sonic/loader v0.1.1
- github.com/cloudwego/base64x v0.1.4
- github.com/cloudwego/iasm v0.2.0
- github.com/gabriel-vasile/mimetype v1.4.3
- github.com/gin-contrib/sse v0.1.0
- github.com/go-playground/locales v0.14.1
- github.com/go-playground/universal-translator v0.18.1
- github.com/go-playground/validator/v10 v10.20.0
- github.com/goccy/go-json v0.10.2
- github.com/json-iterator/go v1.1.12
- github.com/klauspost/cpuid/v2 v2.2.7
- github.com/leodido/go-urn v1.4.0
- github.com/mattn/go-isatty v0.0.20
- github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd
- github.com/modern-go/reflect2 v1.0.2
- github.com/pelletier/go-toml/v2 v2.2.2
- github.com/twitchyliquid64/golang-asm v0.15.1
- github.com/ugorji/go/codec v1.2.12
- golang.org/x/arch v0.8.0
- golang.org/x/net v0.25.0
- golang.org/x/sys v0.20.0
- golang.org/x/text v0.15.0
- google.golang.org/protobuf v1.34.1
- gopkg.in/yaml.v3 v3.0.1

## Frontend (React)

### Requirements

- Node.js v18.16.0 (version compatible with the specified dependencies)
- npm 8.19.3 (included with Node.js)

### Dependencies

- @headlessui/react 2.0.4
- @types/react-tooltip 4.2.4
- axios 1.7.2
- react 18.2.0
- react-dom 18.2.0
- react-tooltip 5.26.4

### Development Dependencies

- @types/axios 0.14.0
- @types/react 18.2.66
- @types/react-dom 18.2.22
- @typescript-eslint/eslint-plugin 7.2.0
- @typescript-eslint/parser 7.2.0
- @vitejs/plugin-react-swc 3.5.0
- autoprefixer 10.4.19
- eslint 8.57.0
- eslint-plugin-react-hooks 4.6.0
- eslint-plugin-react-refresh 0.4.6
- postcss 8.4.38
- tailwindcss 3.4.3
- typescript 5.2.2
- vite 5.2.0

## Installation and Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/ensolvers-github-challenges/Doza-5116a2.git
    cd Doza-5116a2
    ```

2. Make the setup script executable:

    ```sh
    chmod +x start.sh
    ```

3. Run the setup script:

    ```sh
    ./start.sh
    ```

This script will:

- Load environment variables from the `.env` file.
- Install backend dependencies and set up the database schema.
- Install frontend dependencies.
- Build the frontend and start both the backend and frontend servers.

## Configuration

Ensure you have a `.env` file in the `backend` directory with the following variables:

```env
# Backend environment variables
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mydatabase
```

# Default Admin User
ADMIN_USERNAME=admin
ADMIN_PASSWORD=super^Secret!009

## Running the App

After running the setup script, the backend server will be running on http://localhost:8000 and the frontend development server on http://localhost:5173.

## Development

For development, you can start the backend and frontend separately.

### Backend

```sh
cd backend
go run main.go
```

### Frontend

```sh
cd frontend
npm run dev
```

