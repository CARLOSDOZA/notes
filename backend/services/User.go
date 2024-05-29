package services

import (
	"backend/database"
	"backend/models"
)

// Get all users
func GetUsers(User *models.Users) (err error) {
	err = database.Db.Find(User).Error
	if err != nil {
		return err
	}
	return nil
}

// Get user by username
func GetUserByUsername(username string) (models.User, error) {
	var user models.User
	err := database.Db.Where("username=?", username).Find(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := database.Db.Where("email=?", email).Find(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

// Get user by id
func GetUserById(id uint) (models.User, error) {
	var user models.User
	err := database.Db.Where("id=?", id).Find(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}