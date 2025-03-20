package routes

import (
	"pizza_billing/config"
	"pizza_billing/models"

	"github.com/gofiber/fiber/v2"
)

func InvoiceRoutes(app *fiber.App) {
	// Create a new invoice
	app.Post("/invoices", func(c *fiber.Ctx) error {
		var invoice models.Invoice
		if err := c.BodyParser(&invoice); err != nil {
			return c.Status(400).JSON(err.Error())
		}

		// Calculate total amount
		var total float64
		for i, item := range invoice.Items {
			var dbItem models.Item
			config.DB.First(&dbItem, item.ItemID)
			invoice.Items[i].Subtotal = float64(item.Quantity) * dbItem.Price
			total += invoice.Items[i].Subtotal
		}
		invoice.TotalAmount = total

		config.DB.Create(&invoice)
		return c.JSON(invoice)
	})

	// Get all invoices
	app.Get("/invoices", func(c *fiber.Ctx) error {
		var invoices []models.Invoice
		config.DB.Preload("Customer").Preload("Items.Item").Find(&invoices)
		return c.JSON(invoices)
	})
}
