package models

type CategoryForm struct {
	Name   string `json:"Name" binding:"required"`
	UserID uint   `json:"UserID"`
}
