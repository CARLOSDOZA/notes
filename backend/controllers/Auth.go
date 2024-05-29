package controllers

import (
	"backend/utils"
	"net/http"
	"github.com/gin-gonic/gin"
)

func Auth(context *gin.Context) {
	err := utils.ValidateJWT(context)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Auth Failed"})
		return
	}
}
