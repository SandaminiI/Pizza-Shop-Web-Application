package routes

import (
	"pizza_billing/config"
	"pizza_billing/models"

	"github.com/gofiber/fiber/v2"
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

	// Update item
	app.Put("/items/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var item models.Item

		if err := config.DB.First(&item, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
		}

		if err := c.BodyParser(&item); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}

		config.DB.Save(&item)
		return c.JSON(item)
	})

	// Delete item
	app.Delete("/items/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		config.DB.Delete(&models.Item{}, id)
		return c.JSON(fiber.Map{"message": "Item deleted"})
	})
}
