# E-Commerce Frontend

A React-based frontend for the E-Commerce application with product management functionality.

## Features

- **Product Management**: View, add, edit, and delete products (admin only)
- **User Authentication**: Login and registration system
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Product Catalog**: Browse products with filtering and search
- **Shopping Cart**: Add products to cart (basic implementation)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.js       # Navigation bar
├── context/            # React context providers
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── ProductList.js  # Product catalog
│   ├── ProductDetail.js # Product details
│   ├── ProductEdit.js  # Edit product (admin)
│   ├── ProductAdd.js   # Add product (admin)
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   └── Cart.js         # Shopping cart
├── services/           # API services
│   └── api.js          # API functions using fetch
└── App.js              # Main application component
```

## API Integration

The frontend uses the native `fetch` API to communicate with the backend:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT tokens stored in sessionStorage
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Admin Features

To access admin features (product management), you need to:
1. Register a new account
2. Set the `isAdmin` field to `true` in the database
3. Login with the admin account

## Technologies Used

- **React** - Frontend framework
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Fetch API** - HTTP requests
- **Context API** - State management

## Development

The application is configured with:
- **Proxy**: Automatically forwards API requests to the backend
- **Hot Reload**: Changes reflect immediately in development
- **ESLint**: Code linting for better code quality

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder that can be deployed to any static hosting service.
