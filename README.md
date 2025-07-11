# Restaurant Bot - Food Ordering & Reservation System

A comprehensive restaurant management system with online food ordering, table reservations, and payment processing capabilities.

## Features

### 🍽️ Restaurant Management
- Browse restaurants with detailed information
- View menus with prices and descriptions
- Search and filter restaurants by cuisine, location, and price range
- Random restaurant recommendations

### 🛒 Online Food Ordering
- Add items to cart with quantity control
- Special instructions for each item
- Real-time order calculation (subtotal, tax, delivery fee)
- Delivery address management
- Order tracking and status updates

### 💳 Payment Processing
- Stripe integration for secure payments
- Multiple payment methods (card, digital wallet)
- Payment status tracking
- Refund processing
- Order confirmation and receipts

### 📅 Table Reservations
- Make restaurant reservations
- Select date, time, and party size
- Special requests and dietary requirements
- Reservation management (view, edit, cancel)
- Real-time availability checking

### 👤 User Management
- User registration and authentication
- Profile management
- Order history
- Reservation history
- Preference settings

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **bcryptjs** for password hashing

### Frontend
- **React.js** with hooks
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Stripe React** for payment forms

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account for payment processing

### 1. Clone the Repository
```bash
git clone <repository-url>
cd restaurant-bot
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant-bot
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

#### Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

#### Start Frontend Development Server
```bash
npm start
```

### 4. Stripe Setup

#### Create Stripe Account
1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Add the keys to your environment variables

#### Test Card Numbers
Use these test card numbers for testing:
- **Visa**: 4242424242424242
- **Mastercard**: 5555555555554444
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/random` - Get random restaurants
- `GET /api/restaurants/search` - Search restaurants

### Menus
- `GET /api/menus/restaurant/:restaurantId` - Get restaurant menu
- `GET /api/menus/:id` - Get menu by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/user` - Get user's reservations
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/status/:orderId` - Get payment status
- `POST /api/payments/refund/:orderId` - Refund payment

### Users
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

## Database Models

### User
- Basic user information (name, email, password)
- Preferences (cuisine, price range, location)

### Restaurant
- Restaurant details (name, location, cuisine, price range)
- Images and descriptions
- Operating hours and contact information

### Menu
- Menu items with prices and descriptions
- Categories and dietary information
- Images for menu items

### Order
- Order items with quantities and special instructions
- Delivery information and customer details
- Payment status and order status
- Timestamps and tracking information

### Reservation
- Reservation details (date, time, party size)
- Restaurant and user information
- Special requests and status

## Payment Flow

1. **Order Creation**: User creates order with items and delivery details
2. **Payment Intent**: Backend creates Stripe payment intent
3. **Payment Processing**: Frontend processes payment with Stripe
4. **Payment Confirmation**: Backend confirms payment and updates order status
5. **Order Tracking**: User can track order status and delivery

## Order Status Flow

1. **pending** - Order created, waiting for payment
2. **confirmed** - Payment received, order confirmed
3. **preparing** - Restaurant is preparing the order
4. **ready** - Order is ready for delivery
5. **out_for_delivery** - Order is being delivered
6. **delivered** - Order has been delivered
7. **cancelled** - Order has been cancelled

## Reservation Status Flow

1. **pending** - Reservation request submitted
2. **confirmed** - Reservation confirmed by restaurant
3. **cancelled** - Reservation cancelled

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Secure payment processing with Stripe
- Environment variable protection

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud database
2. Deploy to Heroku, Vercel, or AWS
3. Configure environment variables
4. Set up Stripe webhooks for production

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or AWS S3
3. Configure environment variables
4. Update API URLs for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Changelog

### Version 2.0.0
- Added comprehensive payment gateway with Stripe
- Implemented full order management system
- Enhanced reservation functionality
- Added order tracking and status management
- Improved UI/UX with Material-UI components
- Added user preferences and profile management

### Version 1.0.0
- Basic restaurant browsing
- Simple reservation system
- User authentication
- Basic menu viewing #   F O O D - H U N G E R  
 