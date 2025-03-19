package main

import (
	"pizza_billing/config"
	"pizza_billing/models"
)

func RunMigrations() {
	config.ConnectDatabase() // Connect to the database

	// Automatically create tables based on models
	config.DB.AutoMigrate(&models.Item{}, &models.Invoice{}, &models.InvoiceItem{}, &models.Customer{})

	// Add more models if necessary
}
