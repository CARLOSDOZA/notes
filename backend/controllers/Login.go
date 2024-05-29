package controllers

import (
	"backend/models"
	"backend/services"
	"backend/utils"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func Login(context *gin.Context) {
	var input models.Login

	if err := context.ShouldBindJSON(&input); err != nil {
		var errorMessage string
		var validationErrors validator.ValidationErrors
		if errors.As(err, &validationErrors) {
			validationError := validationErrors[0]
			if validationError.Tag() == "required" {
				errorMessage = fmt.Sprintf("%s not provided", validationError.Field())
			}
		}
		context.JSON(http.StatusBadRequest, gin.H{"error": errorMessage})
		return
	}

	// Intenta obtener al usuario por su nombre de usuario
	user, err := services.GetUserByUsername(input.Username)

	if user.ID == 0 {
		// No se encontró ningún usuario por nombre de usuario, intenta obtenerlo por correo electrónico
		user, err = services.GetUserByEmail(input.Username)
	}

	if user.ID == 0 {
		// No se encontró ningún usuario ni por nombre de usuario ni por correo electrónico
		context.JSON(http.StatusBadRequest, gin.H{"error": "Usuario no encontrado"})
		return
	}

	if err != nil {
		// Ocurrió un error al intentar obtener al usuario
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = user.ValidateUserPassword(input.Password)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwt, err := utils.GenerateJWT(user)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"token": jwt, "id": user.ID, "username": input.Username, "message": "Successfully logged in"})

}
