package services

import (
	"golang.org/x/crypto/bcrypt"
	"backend/models"
)

func RegisterService(input *models.Register) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	savedUser, err := user.Save()
	if err != nil {
		return nil, err
	}

	return savedUser, nil
}