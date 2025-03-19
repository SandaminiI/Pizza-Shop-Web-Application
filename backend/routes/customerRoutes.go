package routes

import (
	"pizza_billing/config"
	"pizza_billing/models"

	"github.com/gofiber/fiber/v2"
)

func CustomerRoutes(app *fiber.App) {
	// Get all customers
	app.Get("/customers", func(c *fiber.Ctx) error {
		var customers []models.Customer
		config.DB.Find(&customers)
		return c.JSON(customers)
	})

	// Create a new customer
	app.Post("/customers", func(c *fiber.Ctx) error {
		var customer models.Customer
		if err := c.BodyParser(&customer); err != nil {
			return c.Status(400).JSON(err.Error())
		}
		config.DB.Create(&customer)
		return c.JSON(customer)
	})

	// Update customer
	app.Put("/customers/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var customer models.Customer

		if err := config.DB.First(&customer, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Customer not found"})
		}

		if err := c.BodyParser(&customer); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}

		config.DB.Save(&customer)
		return c.JSON(customer)
	})

	// Delete customer
	app.Delete("/customers/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		config.DB.Delete(&models.Customer{}, id)
		return c.JSON(fiber.Map{"message": "Customer deleted"})
	})
}
