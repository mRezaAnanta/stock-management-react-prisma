# Stock Management App

A full-stack web application for managing product inventory, built with React, Node.js, Express, Prisma, and MySQL.

## Features

- **Product Management**: Full CRUD operations for products
- **Stock Management**: Add, subtract, or set stock quantities
- **Dashboard**: Overview of inventory statistics and alerts
- **Search & Filter**: Find products by name, SKU, or description
- **Stock Alerts**: Visual indicators for low stock and out-of-stock items inside of Dashboard
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- Node.js & Express.js
- Prisma ORM
- MySQL Database

### Frontend
- React 18
- React Router for navigation
- Context API for state management
- Axios for API calls
- Modern CSS with responsive design

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v8.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd stock-management-app
```

### 2. Set up the Backend

#### Install dependencies
```bash
cd backend
npm install
```

#### Configure environment variables
Create a `.env` file in the `backend` directory:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/stock_management"

# Server
PORT=5000

# CORS
FRONTEND_URL="http://localhost:5000"
```

**Important**: Replace the following in your `.env` file:
- `username`: Your MySQL username
- `password`: Your MySQL password
- `stock_management`: Your database name (create this database first)

#### Set up the database
```bash
# Create and migrate the database
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

#### Start the backend server
```bash
npm run dev
```

The backend will run on http://localhost:5000

### 3. Set up the Frontend

#### Install dependencies
```bash
cd frontend
npm install
```

#### Configure environment variables (optional)
Create a `.env` file in the `frontend` directory if you need to change the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the frontend development server
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

### 1. Dashboard
- View inventory statistics (total products, total value, low stock items, out of stock items)
- See alerts for products that need attention
- Quick access to add products or view all products

### 2. Product Management
- **Add Products**: Click "Add New Product" to create products with name, SKU, price, stock, and description
- **View Products**: Browse all products with search and filter capabilities
- **Edit Products**: Update product information
- **Delete Products**: Remove products from inventory

### 4. Stock Management
- Products with stock < 10 are marked as "Low Stock"
- Products with stock = 0 are marked as "Out of Stock"
- Filter products by stock status

## Database Schema

### Product Table
- `id`: Primary key
- `name`: Product name
- `description`: Optional product description
- `price`: Product price
- `stock`: Current stock quantity
- `sku`: Unique stock keeping unit
- `createdAt`: Product creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

### Products
- `GET /api/products` - Get all products for user
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Development

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push     # Push schema changes to database
```

### Frontend Scripts
```bash
npm run dev           # Start development server
npm run build       # Build for production
npm test            # Run tests
```

## Production Deployment

### Backend
1. Set up your production MySQL database
2. Update the `DATABASE_URL` in your production environment
3. Set a secure `JWT_SECRET`
4. Run `npm run prisma:migrate` to set up the database
5. Start with `npm start`

### Frontend
1. Build the production version: `npm run build`
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Update the `REACT_APP_API_URL` to point to your production API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please create an issue in the repository or send me an email at <muhammadRezaAnanta@tutamail.com> with subject "Issue: Stock Management App".
