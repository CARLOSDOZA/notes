package services

import (
	"backend/database"
	"backend/models"
)

func GetCategories(categories *models.Categories) (err error) {
	err = database.Db.Find(categories).Error
	if err != nil {
		return err
	}
	return nil
}

func GetUserCategories(categories *models.Categories, id int) (err error) {
	err = database.Db.Where("user_id = ?", id).Find(categories).Error
	if err != nil {
		return err
	}
	return nil
}