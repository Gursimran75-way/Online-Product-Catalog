# UserTemplate API

![.NET](https://img.shields.io/badge/.NET-8.0-blueviolet) ![EF Core](https://img.shields.io/badge/EF%20Core-8.0-blue) ![JWT](https://img.shields.io/badge/JWT-Authentication-green)

A robust ASP.NET Core Web API for managing users, products, categories, and analytics, secured with JWT authentication and integrated with an Angular frontend. This project demonstrates a clean architecture with services, dependency injection, and Entity Framework Core for data persistence.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Backend](#backend)
  - [Database](#database)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: JWT-based login and registration.
- **Product Management**: CRUD operations for products, including Excel import.
- **Category Management**: CRUD operations for categories.
- **Analytics**: Product counts by category and most-viewed products.
- **Role-Based Authorization**: Admin-only endpoints for sensitive operations.
- **CORS**: Configured for Angular frontend at `http://localhost:4200`.
- **Swagger**: Interactive API documentation with JWT support.

## Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or another EF Core-supported database)
- [Node.js](https://nodejs.org/) (for Angular frontend)
- [Angular CLI](https://angular.io/cli) (install via `npm install -g @angular/cli`)
- [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio](https://visualstudio.microsoft.com/) (optional)

## Setup

### Backend
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/UserTemplate.git
   cd UserTemplate
   ```

2. **Restore Dependencies**:
   ```bash
   dotnet restore
   ```

3. **Configure `appsettings.json`**:
   - Create or update `appsettings.json` in the project root:
     ```json
     {
       "ConnectionStrings": {
         "DefaultConnection": "Server=your_server;Database=UserTemplateDb;Trusted_Connection=True;MultipleActiveResultSets=true"
       },
       "Jwt": {
         "Key": "your_secret_key_at_least_32_chars_long",
         "Issuer": "your_issuer",
         "Audience": "your_audience"
       }
     }
     ```
   - Replace `your_server`, `your_secret_key_at_least_32_chars_long`, `your_issuer`, and `your_audience` with your values.

4. **Apply Migrations**:
   - Ensure you have EF Core tools installed:
     ```bash
     dotnet tool install --global dotnet-ef
     ```
   - Update the database:
     ```bash
     dotnet ef database update --project src/UserTemplate
     ```

5. **Run the API**:
   ```bash
   dotnet run --project src/UserTemplate
   ```
   - The API runs at `https://localhost:5001` (or your configured port). Swagger UI is available at `/swagger` in development.

### Database
- Uses Entity Framework Core with SQL Server.
- Models: `User`, `Product`, `Category`.
- Run migrations to create the database schema (see above).

### Frontend
1. **Navigate to Angular Project** (assuming it’s in a subfolder, e.g., `ClientApp`):
   ```bash
   cd ClientApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Frontend**:
   ```bash
   ng serve
   ```
   - The Angular app runs at `http://localhost:4200` and connects to the API via CORS.

## API Endpoints

### Authentication
- **POST /api/auth/login**
  - Body: `{ "username": "string", "password": "string" }`
  - Response: JWT token
- **POST /api/auth/register**
  - Body: `{ "username": "string", "password": "string", "role": "string" }`
  - Response: 201 Created

### Products
- **GET /api/products**: Fetch all products.
- **GET /api/products/{id}**: Fetch a product by ID (increments `ViewCount`).
- **POST /api/products**: Create a product (Admin only).
  - Body: `{ "name": "string", "price": number, "categoryId": number, "image": "string", "viewCount": number }`
- **PUT /api/products/{id}**: Update a product (Admin only).
- **DELETE /api/products/{id}**: Delete a product (Admin only).
- **POST /api/products/import**: Import products from an `.xlsx` file (Admin only).
  - Form: `IFormFile` (Excel file)

### Categories
- **GET /api/categories**: Fetch all categories with products.
- **POST /api/categories**: Create a category (Admin only).
  - Body: `{ "name": "string" }`
- **PUT /api/categories/{id}**: Update a category (Admin only).
- **DELETE /api/categories/{id}**: Delete a category (Admin only).

### Analytics (Admin only)
- **GET /api/analytics/product-count-by-category**: Product counts per category.
- **GET /api/analytics/most-viewed**: Most viewed product.
- **GET /api/analytics/most-viewed-by-category/{categoryId}**: Most viewed product in a category.

## Usage
1. **Start the Backend**: Run `dotnet run` in the `src/UserTemplate` directory.
2. **Start the Frontend**: Run `ng serve` in the `ClientApp` directory.
3. **Access Swagger**: Open `https://localhost:5001/swagger` to test endpoints.
4. **Authenticate**: Use the `/api/auth/login` endpoint to get a JWT, then add it to requests (e.g., `Authorization: Bearer {token}`).

### Example `.xlsx` for Import
| Name       | Price | CategoryId | Image             |
|------------|-------|------------|-------------------|
| Product 1  | 10.99 | 1          | http://image.jpg  |
| Product 2  | 15.50 | 2          | http://image2.jpg |

- First row is ignored (header); data starts from row 2.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---