package database

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

var Db *gorm.DB

func InitDb() *gorm.DB {
	Db = connectDB()
	return Db
}

func connectDB() *gorm.DB {
	var err error
	host := os.Getenv("DB_HOST")
	username := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, host, port, dbname)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database:%v", err)
	}
	log.Println("Successfully connected to the database")

	// Verificar si la base de datos existe
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Error getting DB object:", err)
		return nil
	}

	rows, err := sqlDB.Query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", dbname)
	if err != nil {
		log.Fatal("Error checking database existence:", err)
		return nil
	}
	defer rows.Close()

	// Si la base de datos no existe, crear el schema
	if !rows.Next() {
		log.Println("Database does not exist, creating schema...")
		err = sqlDB.Ping()
		if err != nil {
			log.Fatal("Error pinging database:", err)
			return nil
		}

		_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", dbname))
		if err != nil {
			log.Fatal("Error creating database:", err)
			return nil
		}
		log.Println("Database created successfully")
	}

	// Conectarse a la base de datos especificada
	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, host, port, dbname)
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database after creation:", err)
		return nil
	}
	return db
}
