package services

import (
	"backend/models"
	"errors"

	"gorm.io/gorm"
)



func CreateNoteService(input models.NoteForm) (*models.Note, error) {

	note := models.Note{
		Title:      input.Title,
		Content:    input.Content,
		CategoryID: input.CategoryID,
		UserID:     input.UserID,
	}

	savedNote, err := note.Save()
	if err != nil {
		return nil, err
	}

	return savedNote, nil
}

func GetUserNotesService(userID int) (*models.Notes, error) {
	var notes models.Notes

	err := models.GetUserNotes(&notes, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}

	return &notes, nil
}

func UpdateNoteService(id int, updatedNote *models.Note) error {
	var existingNote models.Note
	err := models.GetNote(&existingNote, id)
	if err != nil {
		return err
	}

	existingNote.Title = updatedNote.Title
	existingNote.Content = updatedNote.Content
	existingNote.CategoryID = updatedNote.CategoryID
	existingNote.UserID = updatedNote.UserID

	err = models.UpdateNote(&existingNote)
	if err != nil {
		return err 
	}

	return nil
}

func ArchiveNoteService(id int) (*models.Note, error) {
	var note models.Note
	err := models.GetNote(&note, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}

	note.Archived = !note.Archived

	_, err = note.Save()
	if err != nil {
		return nil, err
	}

	return &note, nil
}

func DeleteNoteService(id int) error {
	var note models.Note
	err := models.GetNote(&note, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		return err
	}
	err = models.DeleteNote(&note)
	if err != nil {
		return err
	}

	return nil
}