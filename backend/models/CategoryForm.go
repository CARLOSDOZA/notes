package models

type CategoryForm struct {
	Name   string `json:"name" binding:"required"`
	UserID uint   `json:"user_id"`
}
