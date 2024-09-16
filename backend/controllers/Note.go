package controllers

import (
	"backend/models"
	"backend/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func GetUserNotes(context *gin.Context) {
	userID, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	notes, err := services.GetUserNotesService(userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, notes)
}

func CreateNote(context *gin.Context) {
	var input models.NoteForm
	fmt.Println(input)

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	savedNote, err := services.CreateNoteService(input)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"note": savedNote})
}

func UpdateNote(context *gin.Context) {
	var updatedNote models.Note
	id, _ := strconv.Atoi(context.Param("id"))

	if err := context.ShouldBindJSON(&updatedNote); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.UpdateNoteService(id, &updatedNote)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, updatedNote)
}

func ArchiveNote(context *gin.Context) {
	id, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	archivedNote, err := services.ArchiveNoteService(id)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	context.JSON(http.StatusOK, archivedNote)
}

func DeleteNote(context *gin.Context) {
	id, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = services.DeleteNoteService(id)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
	}

	context.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}
