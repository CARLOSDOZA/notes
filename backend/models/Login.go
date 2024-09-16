package models

type Login struct {
	Username string `json:"Username" binding:"required"`
	Password string `json:"Password" binding:"required"`
}