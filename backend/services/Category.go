package services

import (
	"backend/models"
)

func CreateCategoryService(input models.CategoryForm) (*models.Category, error) {
	category := models.Category{
		Name:   input.Name,
		UserID: input.UserID,
	}

	savedCategory, err := category.Save()
	if err != nil {
		return nil, err
	}

	return savedCategory, nil
}

func GetUserCategoriesService(categories *models.Categories, id int) error {
	err := models.GetUserCategories(categories, id)
	return err
}
