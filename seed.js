import mongoose from 'mongoose';
import Restaurant from './models/Restaurant.js';
import Menu from './models/Menu.js';

// Sample restaurant data
const sampleRestaurants = [
  {
    name: "La Bella Italia",
    description: "Authentic Italian cuisine with a modern twist. Fresh pasta, wood-fired pizzas, and fine wines in an elegant setting.",
    cuisine: ["Italian", "Mediterranean", "Pizza"],
    location: "Downtown",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop"
  },
  {
    name: "Sakura Sushi",
    description: "Premium sushi and Japanese cuisine. Fresh fish, traditional techniques, and beautiful presentation.",
    cuisine: ["Japanese", "Sushi", "Asian"],
    location: "Midtown",
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop"
  },
  {
    name: "Taco Fiesta",
    description: "Vibrant Mexican street food with bold flavors. Tacos, burritos, and margaritas in a festive atmosphere.",
    cuisine: ["Mexican", "Latin", "Street Food"],
    location: "West Side",
    priceRange: "$",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=200&fit=crop"
  },
  {
    name: "Le Petit Bistro",
    description: "Charming French bistro serving classic dishes. Cozy atmosphere with excellent wine selection.",
    cuisine: ["French", "European", "Bistro"],
    location: "East Side",
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
  },
  {
    name: "Spice Garden",
    description: "Authentic Indian cuisine with aromatic spices. Traditional dishes from various regions of India.",
    cuisine: ["Indian", "Asian", "Vegetarian"],
    location: "North Side",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=200&fit=crop"
  },
  {
    name: "Burger Haven",
    description: "Gourmet burgers and comfort food. Handcrafted patties with premium ingredients and creative toppings.",
    cuisine: ["American", "Burgers", "Comfort Food"],
    location: "Downtown",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop"
  },
  {
    name: "Pho Palace",
    description: "Traditional Vietnamese pho and noodle dishes. Fresh herbs, rich broths, and authentic flavors.",
    cuisine: ["Vietnamese", "Asian", "Noodles"],
    location: "South Side",
    priceRange: "$",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop"
  },
  {
    name: "Steakhouse Prime",
    description: "Premium steaks and fine dining experience. Aged beef, classic sides, and extensive wine list.",
    cuisine: ["American", "Steakhouse", "Fine Dining"],
    location: "Downtown",
    priceRange: "$$$$",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop"
  },
  {
    name: "Mediterranean Delight",
    description: "Fresh Mediterranean cuisine with healthy options. Grilled meats, fresh salads, and olive oil dishes.",
    cuisine: ["Mediterranean", "Greek", "Healthy"],
    location: "Midtown",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop"
  },
  {
    name: "Dragon Wok",
    description: "Authentic Chinese cuisine with wok-fried dishes. Dim sum, noodles, and traditional favorites.",
    cuisine: ["Chinese", "Asian", "Noodles"],
    location: "Chinatown",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop"
  },
  {
    name: "Pizza Palace",
    description: "Artisanal pizzas with creative toppings. Wood-fired oven, fresh ingredients, and craft beer selection.",
    cuisine: ["Italian", "Pizza", "Casual"],
    location: "West Side",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop"
  },
  {
    name: "Seafood Cove",
    description: "Fresh seafood and coastal cuisine. Daily catch, grilled fish, and ocean views.",
    cuisine: ["Seafood", "American", "Coastal"],
    location: "Harbor District",
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=200&fit=crop"
  }
];

// Sample menu items for seeding
const sampleMenuItems = [
  [
    { name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil.', price: 12.99, image: '' },
    { name: 'Spaghetti Carbonara', description: 'Pasta with pancetta, egg, and parmesan.', price: 14.99, image: '' },
    { name: 'Tiramisu', description: 'Coffee-flavored Italian dessert.', price: 7.99, image: '' }
  ],
  [
    { name: 'Salmon Nigiri', description: 'Fresh salmon over sushi rice.', price: 4.99, image: '' },
    { name: 'California Roll', description: 'Crab, avocado, and cucumber roll.', price: 8.99, image: '' },
    { name: 'Miso Soup', description: 'Traditional Japanese soup.', price: 3.99, image: '' }
  ],
  [
    { name: 'Chicken Tacos', description: 'Grilled chicken with salsa and cheese.', price: 9.99, image: '' },
    { name: 'Beef Burrito', description: 'Flour tortilla with beef, beans, and rice.', price: 11.99, image: '' },
    { name: 'Churros', description: 'Fried-dough pastry with cinnamon sugar.', price: 5.99, image: '' }
  ],
  [
    { name: 'French Onion Soup', description: 'Classic soup with caramelized onions and cheese.', price: 8.99, image: '' },
    { name: 'Coq au Vin', description: 'Chicken braised with wine, mushrooms, and bacon.', price: 16.99, image: '' },
    { name: 'Crème Brûlée', description: 'Rich custard topped with caramelized sugar.', price: 7.99, image: '' }
  ],
  [
    { name: 'Paneer Tikka', description: 'Grilled paneer with spices.', price: 10.99, image: '' },
    { name: 'Chicken Biryani', description: 'Spiced rice with chicken.', price: 13.99, image: '' },
    { name: 'Gulab Jamun', description: 'Sweet milk-solid-based dessert.', price: 4.99, image: '' }
  ],
  [
    { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and cheese.', price: 11.99, image: '' },
    { name: 'Fries', description: 'Crispy golden fries.', price: 3.99, image: '' },
    { name: 'Milkshake', description: 'Vanilla, chocolate, or strawberry.', price: 5.99, image: '' }
  ],
  [
    { name: 'Pho Bo', description: 'Vietnamese beef noodle soup.', price: 10.99, image: '' },
    { name: 'Spring Rolls', description: 'Fresh rolls with shrimp and veggies.', price: 6.99, image: '' },
    { name: 'Iced Coffee', description: 'Vietnamese-style iced coffee.', price: 4.99, image: '' }
  ],
  [
    { name: 'Ribeye Steak', description: 'Juicy ribeye cooked to order.', price: 24.99, image: '' },
    { name: 'Mashed Potatoes', description: 'Creamy mashed potatoes.', price: 5.99, image: '' },
    { name: 'Cheesecake', description: 'Classic New York cheesecake.', price: 8.99, image: '' }
  ],
  [
    { name: 'Greek Salad', description: 'Salad with feta, olives, and veggies.', price: 9.99, image: '' },
    { name: 'Lamb Gyro', description: 'Pita with lamb, tzatziki, and veggies.', price: 12.99, image: '' },
    { name: 'Baklava', description: 'Sweet pastry with nuts and honey.', price: 6.99, image: '' }
  ],
  [
    { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts.', price: 12.99, image: '' },
    { name: 'Dim Sum Platter', description: 'Assorted dim sum.', price: 14.99, image: '' },
    { name: 'Egg Fried Rice', description: 'Rice with egg and vegetables.', price: 7.99, image: '' }
  ],
  [
    { name: 'Pepperoni Pizza', description: 'Pizza with pepperoni and cheese.', price: 13.99, image: '' },
    { name: 'Garlic Knots', description: 'Bread knots with garlic and herbs.', price: 4.99, image: '' },
    { name: 'Cannoli', description: 'Sicilian pastry dessert.', price: 6.99, image: '' }
  ],
  [
    { name: 'Grilled Salmon', description: 'Salmon fillet with lemon butter.', price: 18.99, image: '' },
    { name: 'Clam Chowder', description: 'Creamy soup with clams and potatoes.', price: 8.99, image: '' },
    { name: 'Key Lime Pie', description: 'Tart and sweet pie.', price: 7.99, image: '' }
  ]
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurant-bot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing restaurants and menus
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    console.log('Cleared existing restaurants and menus');

    // Insert sample restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`Successfully seeded ${restaurants.length} restaurants`);

    // Add a menu for each restaurant
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      const items = sampleMenuItems[i % sampleMenuItems.length];
      const menu = await Menu.create({ restaurant: restaurant._id, items });
      restaurant.menu = [menu._id];
      await restaurant.save();
      console.log(`Added menu for ${restaurant.name}`);
    }

    // Display some sample data
    console.log('\nSample restaurants and menus added:');
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`- ${restaurant.name} (${restaurant.cuisine.join(', ')}) - ${restaurant.location}`);
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed script
if (process.argv.includes('--seed')) {
  connectDB().then(() => {
    seedDatabase();
  });
}

export { connectDB, seedDatabase }; 