package controllers

import (
	"backend/models"
	"backend/services"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func GetUserNotes(context *gin.Context) {
	var Notes models.Notes
	id, _ := strconv.Atoi(context.Param("id"))
	err := services.GetUserNotes(&Notes, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	context.JSON(http.StatusOK, Notes)
}

func CreateNote(context *gin.Context) {
	var input models.NoteForm

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(input)

	note := models.Note{
		Title:      input.Title,
		Content:    input.Content,
		CategoryID: input.CategoryID,
		UserID:     input.UserID,
	}

	savedNote, err := note.Save()
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"postulation": savedNote})

}

func UpdateNote(context *gin.Context) {
	//var input model.Update
	var Note models.Note
	id, _ := strconv.Atoi(context.Param("id"))

	err := services.GetNote(&Note, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}

		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	context.BindJSON(&Note)
	err = services.UpdateNote(&Note)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	context.JSON(http.StatusOK, Note)
}

func ArchiveNote(context *gin.Context) {
	var note models.Note
	id, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = services.GetNote(&note, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Invertir el estado de Archived
	note.Archived = !note.Archived

	// Guardar el cambio usando el método Save
	_, err = note.Save()
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, note)
	fmt.Println(note)
}

func DeleteNote(context *gin.Context) {
	//var input model.Update
	var Note models.Note
	id, _ := strconv.Atoi(context.Param("id"))

	err := services.GetNote(&Note, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context.AbortWithStatus(http.StatusNotFound)
			return
		}

		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	err = services.DeleteNote(&Note)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	context.JSON(http.StatusOK, Note)
}
