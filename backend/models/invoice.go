package models

import "gorm.io/gorm"

type Invoice struct {
	gorm.Model
	CustomerID  uint    `json:"customer_id"`
	TotalAmount float64 `json:"total_amount"`
}
