package controllers

import (
	"backend/models"
	"backend/services"
	"errors"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func GetUserCategories(context *gin.Context) {
	var Categories models.Categories
	id, _ := strconv.Atoi(context.Param("id"))
	err := services.GetUserCategoriesService(&Categories, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	context.JSON(http.StatusOK, Categories)
}

func CreateCategory(context *gin.Context) {
	var input models.CategoryForm

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	savedCategory, err := services.CreateCategoryService(input)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"category": savedCategory})
}