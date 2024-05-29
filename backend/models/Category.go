package models

import (
	"backend/database"

	"github.com/jinzhu/gorm"
)

type Category struct {
	gorm.Model
	ID     uint   `gorm:"primary_key"`
	Name   string `gorm:"not null;unique" json:"name"`
	UserID uint   `gorm:"not null" json:"user_id"`
	User   User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

type Categories []Category

func (category *Category) Save() (*Category, error) {
	err := database.Db.Save(&category).Error
	if err != nil {
		return &Category{}, err
	}
	return category, nil

}