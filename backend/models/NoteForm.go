package models

type NoteForm struct {
	ID         uint   `json:"ID"`
	Title      string `json:"Title" binding:"required"`
	Content    string `json:"Content" binding:"required"`
	CategoryID uint   `json:"CategoryID" binding:"required"`
	UserID     uint   `json:"UserID" binding:"required"`
}
