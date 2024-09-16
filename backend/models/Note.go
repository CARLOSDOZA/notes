package models

import (
	"backend/database"

	"github.com/jinzhu/gorm"
)

type Note struct {
	gorm.Model
	ID         uint     `gorm:"primary_key"`
	Title      string   `gorm:"not null" json:"Title"`
	Content    string   `gorm:"not null" json:"Content"`
	CategoryID uint     `gorm:"not null" json:"CategoryID"`
	UserID     uint     `gorm:"not null" json:"UserID"`
	Archived   bool     `gorm:"not null DEFAULT:false" json:"Archived"`
	User       User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Category   Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

type Notes []Note

func (note *Note) Save() (*Note, error) {
	err := database.Db.Save(&note).Error
	if err != nil {
		return &Note{}, err
	}
	return note, nil
}

func GetNote(note *Note, id int) (err error) {
	err = database.Db.Where("id = ?", id).First(note).Error
	if err != nil {
		return err
	}
	return nil
}

func GetUserNotes(notes *Notes, id int) (err error) {
	err = database.Db.Where("user_id = ?", id).Find(notes).Error
	if err != nil {
		return err
	}
	return nil
}

func UpdateNote(Note *Note) (err error) {
	err = database.Db.Omit("user_id").Updates(Note).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteNote(Note *Note) (err error) {
	database.Db.Delete(Note)
	return nil
}
