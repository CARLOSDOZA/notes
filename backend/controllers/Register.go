package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"github.com/gin-gonic/gin"
)

func Register(context *gin.Context) {
	var input models.Register

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	savedUser, err := services.RegisterService(&input)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"user": savedUser})
}