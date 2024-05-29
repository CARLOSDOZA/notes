package models

type NoteForm struct {
	ID         uint   `json:"id"`
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content" binding:"required"`
	CategoryID uint   `json:"category_id" binding:"required"`
	UserID     uint   `json:"user_id"`
}
