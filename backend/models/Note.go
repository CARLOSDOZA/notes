package models

import (
	"backend/database"

	"github.com/jinzhu/gorm"
)

type Note struct {
	gorm.Model
	ID         uint     `gorm:"primary_key"`
	Title      string   `gorm:"not null" json:"title"`
	Content    string   `gorm:"not null" json:"content"`
	CategoryID uint     `gorm:"not null" json:"category_id"`
	UserID     uint     `gorm:"not null" json:"user_id"`
	Archived   bool     `gorm:"not null DEFAULT:false" json:"archived"`
	User       User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Category   Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

type Notes []Note

// Save note
func (note *Note) Save() (*Note, error) {
	err := database.Db.Save(&note).Error
	if err != nil {
		return &Note{}, err
	}
	return note, nil
}
