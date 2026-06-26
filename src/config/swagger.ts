import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "inventory-distribution-api",
      version: "1.0.0",
      description:
        "REST API for managing rice milling operations, procurement, inventory, production, sales, and distribution. Built as a portfolio project based on real-world business processes at UD Barokah, a family-owned rice milling and logistics company partnered with BULOG (Indonesian National Food Reserve Agency).",
    },
    servers: [
      {
        url: "https://inventory-distribution-api-production.up.railway.app/api/v1",
      },
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
