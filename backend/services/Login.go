package services

import (
	"backend/models"
	"backend/utils"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
)

func LoginService(input models.Login) (string, uint, error) {

	user, err := models.GetUserByUsername(input.Username)
	if err != nil {
		return "", 0, err
	}

	if user.ID == 0 {
		user, err = models.GetUserByEmail(input.Username)
		if err != nil {
			return "", 0, err
		}
	}

	if user.ID == 0 {
		return "", 0, errors.New("user not found")
	}

	err = user.ValidateUserPassword(input.Password)
	if err != nil {
		return "", 0, err
	}

	jwt, err := utils.GenerateJWT(user)
	if err != nil {
		return "", 0, err
	}

	return jwt, user.ID, nil
}

func ValidateLoginInput(input models.Login) error {
	validate := validator.New()
	err := validate.Struct(input)
	if err != nil {
		var validationErrors validator.ValidationErrors
		if errors.As(err, &validationErrors) {
			validationError := validationErrors[0]
			if validationError.Tag() == "required" {
				return fmt.Errorf("%s not provided", validationError.Field())
			}
		}
		return err
	}
	return nil
}