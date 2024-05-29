package main

import (
	"backend/controllers"
	"backend/database"
	"backend/models"
	"backend/utils"
	"fmt"
	"log"
	"os"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// load environment file
	loadEnv()
	// load database configuration and connection
	loadDatabase()
	// load seed
	seedDatabase()
	// start the server
	serveApplication()
}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	log.Println(".env file loaded successfully")
}

func loadDatabase() {
	database.InitDb()
	database.Db.Migrator().DropTable(&models.Note{}, &models.Category{}, &models.User{})
	database.Db.AutoMigrate(&models.User{})
	database.Db.AutoMigrate(&models.Note{})
	database.Db.AutoMigrate(&models.Category{})
}

func seedDatabase() {
	// Seed the database with initial data
	err := SeedAdminUser()
	if err != nil {
		log.Fatalf("Error seeding admin user: %v", err)
	}

	err = SeedCategories()
	if err != nil {
		log.Fatalf("Error seeding categories: %v", err)
	}

	err = SeedNotes()
	if err != nil {
		log.Fatalf("Error seeding notes: %v", err)
	}
}

func SeedAdminUser() error {
	// Seed admin user from .env
	adminUsername := os.Getenv("ADMIN_USERNAME")
	adminPassword := os.Getenv("ADMIN_PASSWORD")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	adminUser := models.User{
		Username: adminUsername,
		Email:    "admin@example.com", // Adjust email as needed
		Password: string(hashedPassword),
	}

	// Save admin user to the database
	result := database.Db.Create(&adminUser)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func SeedCategories() error {

	category1 := models.Category{
		Name:   "Personal",
		UserID: 1, // Assuming admin user ID is 1 (adjust as per your seeding logic)
	}
	category2 := models.Category{
		Name:   "Work",
		UserID: 1,
	}

	// Save categories to the database
	err := database.Db.Create(&category1).Error
	if err != nil {
		return err
	}

	err = database.Db.Create(&category2).Error
	if err != nil {
		return err
	}

	return nil
}

func SeedNotes() error {

	note1 := models.Note{
		Title:      "First Note",
		Content:    "This is the content of the first note",
		CategoryID: 1, // Assuming category ID 1 (adjust as per your seeding logic)
		UserID:     1, // Assuming admin user ID 1 (adjust as per your seeding logic)
		Archived:   false,
	}
	note2 := models.Note{
		Title:      "Work Meeting",
		Content:    "Prepare agenda and discussion points",
		CategoryID: 2, // Assuming category ID 2 (adjust as per your seeding logic)
		UserID:     1, // Assuming admin user ID 1 (adjust as per your seeding logic)
		Archived:   false,
	}

	// Save notes to the database
	err := database.Db.Create(&note1).Error
	if err != nil {
		return err
	}

	err = database.Db.Create(&note2).Error
	if err != nil {
		return err
	}

	return nil
}

func serveApplication() {
	// Create Gin router
	router := gin.Default()

	// Apply CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}                                       // Allow requests from any origin
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}            // Allow certain HTTP methods
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"} // Allow certain headers, including Authorization for JWT
	router.Use(cors.New(config))

	// Authentication routes
	authRoutes := router.Group("/auth")
	authRoutes.GET("/", controllers.Auth)
	authRoutes.POST("/register", controllers.Register)
	authRoutes.POST("/login", controllers.Login)

	// User routes
	userRoutes := router.Group("/user")
	userRoutes.Use(utils.JWTAuthUser())
	userRoutes.GET("/notes/:id", controllers.GetUserNotes)
	userRoutes.POST("/note", controllers.CreateNote)
	userRoutes.PUT("/note/:id", controllers.UpdateNote)
	userRoutes.DELETE("/note/:id", controllers.DeleteNote)
	userRoutes.PUT("/archive/:id", controllers.ArchiveNote)
	userRoutes.POST("/categories", controllers.CreateCategory)
	userRoutes.GET("/categories/:id", controllers.GetUserCategories)

	// Start the server
	router.Run(":8000")
	fmt.Println("Server running on port 8000")
}
