package models

import (
	"gorm.io/gorm"
)

type Invoice struct {
	gorm.Model
	CustomerID  uint           `json:"customer_id"`
	Customer    Customer       `gorm:"foreignKey:CustomerID"`
	Items       []InvoiceItem  `gorm:"foreignKey:InvoiceID"`
	TotalAmount float64        `json:"total_amount"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type InvoiceItem struct {
	InvoiceItemID uint           `gorm:"primaryKey;column:invoice_item_id" json:"invoice_item_id"` // Explicitly set as primary key
	InvoiceID     uint           `json:"invoice_id"`
	ItemID        uint           `json:"item_id"`
	Item          Item           `gorm:"foreignKey:ItemID"`
	Quantity      int            `json:"quantity"`
	Subtotal      float64        `json:"subtotal"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
