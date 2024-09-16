package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	var input models.Login

	if err := context.ShouldBindJSON(&input); err != nil {
		validationErr := services.ValidateLoginInput(input)
		if validationErr != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwt, userID, err := services.LoginService(input)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"token": jwt, "id": userID, "username": input.Username, "message": "Successfully logged in"})
}
