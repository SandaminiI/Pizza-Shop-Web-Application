// package main

// import (
// 	"pizza_billing/config"
// 	"pizza_billing/routes"

// 	"github.com/gofiber/fiber/v2"
// )

// func main() {
// 	app := fiber.New()
// 	config.ConnectDatabase()

// 	routes.ItemRoutes(app)

// 	app.Listen(":3001")
// }

package main

import (
	"pizza_billing/config"
	"pizza_billing/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Allow frontend URL
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	config.ConnectDatabase()
	routes.ItemRoutes(app)

	app.Listen(":3001")
}
