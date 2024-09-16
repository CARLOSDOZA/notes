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
	loadEnv()
	loadDatabase()
	seedDatabase()
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
	adminUsername := os.Getenv("ADMIN_USERNAME")
	adminPassword := os.Getenv("ADMIN_PASSWORD")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	adminUser := models.User{
		Username: adminUsername,
		Email:    "admin@example.com",
		Password: string(hashedPassword),
	}

	result := database.Db.Create(&adminUser)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func SeedCategories() error {

	category1 := models.Category{
		Name:   "Personal",
		UserID: 1,
	}
	category2 := models.Category{
		Name:   "Work",
		UserID: 1,
	}

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
		Content:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consequat auctor risus, quis ultrices nibh scelerisque eu. Sed vitae faucibus turpis. Mauris vitae convallis nisl. Nullam eu ante id nisl aliquet molestie. Vestibulum eu tristique ipsum. Integer eu blandit tellus, non rhoncus est. Mauris et tortor vel quam euismod consequat. Nullam tempor a lorem ac condimentum.",
		CategoryID: 1, 
		UserID:     1, 
		Archived:   false,
	}
	note2 := models.Note{
		Title:      "Work Meeting",
		Content:    "Phasellus eu gravida ex. Aliquam consectetur magna at purus sodales, eu iaculis massa vehicula. In non ligula vehicula, scelerisque dolor ac, volutpat nisi. Morbi cursus, lectus nec efficitur eleifend, massa ligula convallis felis, quis facilisis nunc velit nec nisi. ",
		CategoryID: 2,
		UserID:     1,
		Archived:   false,
	}

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
	router := gin.Default()

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
