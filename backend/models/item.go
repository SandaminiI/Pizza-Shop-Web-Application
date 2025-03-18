package models

import "gorm.io/gorm"

type Item struct {
	gorm.Model
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Price    float64 `json:"price"`
}
