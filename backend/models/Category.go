package models

import (
	"backend/database"
	"github.com/jinzhu/gorm"
)

type Category struct {
	gorm.Model
	ID     uint   `gorm:"primary_key"`
	Name   string `gorm:"not null" json:"Name"`
	UserID uint   `gorm:"not null" json:"UserID"`
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

func GetCategories(categories *Categories) (err error) {
	err = database.Db.Find(categories).Error
	if err != nil {
		return err
	}
	return nil
}

func GetUserCategories(categories *Categories, id int) (err error) {
	err = database.Db.Where("user_id = ?", id).Find(categories).Error
	if err != nil {
		return err
	}
	return nil
}