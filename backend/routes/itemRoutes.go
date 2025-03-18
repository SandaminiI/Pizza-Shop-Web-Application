package routes

import (
	"github.com/gofiber/fiber/v2"
	"pizza_billing/config"
	"pizza_billing/models"
)

func ItemRoutes(app *fiber.App) {
	// Get all items
	app.Get("/items", func(c *fiber.Ctx) error {
		var items []models.Item
		config.DB.Find(&items)
		return c.JSON(items)
	})

	// Create a new item
	app.Post("/items", func(c *fiber.Ctx) error {
		var item models.Item
		if err := c.BodyParser(&item); err != nil {
			return c.Status(400).JSON(err.Error())
		}
		config.DB.Create(&item)
		return c.JSON(item)
	})
}
