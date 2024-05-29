package services

import (
	"backend/database"
	"backend/models"
)

// Get User Notes
func GetNote(note *models.Note, id int) (err error) {
	err = database.Db.Where("id = ?", id).First(note).Error
	if err != nil {
		return err
	}
	return nil
}

// Get User Notes
func GetUserNotes(notes *models.Notes, id int) (err error) {
	err = database.Db.Where("user_id = ?", id).Find(notes).Error
	if err != nil {
		return err
	}
	return nil
}

// Update user
func UpdateNote(Note *models.Note) (err error) {
	err = database.Db.Omit("user_id").Updates(Note).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteNote(Note *models.Note) (err error) {
	database.Db.Delete(Note)
	return nil
}