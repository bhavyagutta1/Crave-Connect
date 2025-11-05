require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const CookOff = require('../models/CookOff');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Recipe.deleteMany();
    await Comment.deleteMany();
    await CookOff.deleteMany();

    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@craveconnect.com',
        password: 'admin123',
        role: 'Admin',
        bio: 'Platform administrator and food enthusiast',
        weeklyPoints: 500,
        totalPoints: 5000,
        badges: [
          { name: 'Founder', icon: '👑' },
          { name: 'Master Chef', icon: '👨‍🍳' }
        ]
      },
      {
        username: 'chef_maria',
        email: 'maria@example.com',
        password: 'password123',
        role: 'Chef',
        bio: 'Italian cuisine specialist with 15 years of experience',
        weeklyPoints: 350,
        totalPoints: 3500,
        badges: [
          { name: 'Italian Master', icon: '🇮🇹' },
          { name: 'Top Chef', icon: '⭐' }
        ]
      },
      {
        username: 'chef_takeshi',
        email: 'takeshi@example.com',
        password: 'password123',
        role: 'Chef',
        bio: 'Japanese sushi master and ramen expert',
        weeklyPoints: 320,
        totalPoints: 3200,
        badges: [
          { name: 'Sushi Master', icon: '🍣' },
          { name: 'Ramen King', icon: '🍜' }
        ]
      },
      {
        username: 'chef_raj',
        email: 'raj@example.com',
        password: 'password123',
        role: 'Chef',
        bio: 'Indian curry specialist from Mumbai',
        weeklyPoints: 280,
        totalPoints: 2800,
        badges: [
          { name: 'Spice Master', icon: '🌶️' }
        ]
      },
      {
        username: 'foodie_sarah',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'Foodie',
        bio: 'Food lover and recipe collector',
        weeklyPoints: 150,
        totalPoints: 1500
      },
      {
        username: 'foodie_mike',
        email: 'mike@example.com',
        password: 'password123',
        role: 'Foodie',
        bio: 'Always hunting for the best recipes',
        weeklyPoints: 120,
        totalPoints: 1200
      }
    ]);

    console.log('Created users');

    // Create recipes
    const recipes = await Recipe.create([
      {
        title: 'Classic Margherita Pizza',
        description: 'Authentic Italian pizza with fresh mozzarella, tomatoes, and basil. Perfect crispy crust with a delicious homemade sauce.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
        cuisine: 'Italian',
        category: 'Dinner',
        ingredients: [
          { name: 'Pizza dough', quantity: '1 ball' },
          { name: 'Tomato sauce', quantity: '1/2 cup' },
          { name: 'Fresh mozzarella', quantity: '200g' },
          { name: 'Fresh basil', quantity: '10 leaves' },
          { name: 'Olive oil', quantity: '2 tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Preheat oven to 475°F (245°C)' },
          { step: 2, description: 'Roll out pizza dough on a floured surface' },
          { step: 3, description: 'Spread tomato sauce evenly on dough' },
          { step: 4, description: 'Add torn mozzarella pieces' },
          { step: 5, description: 'Bake for 12-15 minutes until crust is golden' },
          { step: 6, description: 'Top with fresh basil and drizzle with olive oil' }
        ],
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        difficulty: 'Medium',
        chef: users[1]._id,
        likes: [users[4]._id, users[5]._id],
        ratings: [
          { user: users[4]._id, rating: 5 },
          { user: users[5]._id, rating: 5 }
        ],
        views: 245,
        isTrending: true,
        isFeatured: true,
        tags: ['pizza', 'italian', 'vegetarian']
      },
      {
        title: 'Authentic Sushi Rolls',
        description: 'Fresh and delicious sushi rolls with salmon, avocado, and cucumber. Learn the art of perfect sushi rice.',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        cuisine: 'Japanese',
        category: 'Dinner',
        ingredients: [
          { name: 'Sushi rice', quantity: '2 cups' },
          { name: 'Nori sheets', quantity: '4 sheets' },
          { name: 'Fresh salmon', quantity: '200g' },
          { name: 'Avocado', quantity: '1' },
          { name: 'Cucumber', quantity: '1' },
          { name: 'Rice vinegar', quantity: '3 tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Cook sushi rice according to package instructions' },
          { step: 2, description: 'Mix rice with rice vinegar and let cool' },
          { step: 3, description: 'Place nori on bamboo mat' },
          { step: 4, description: 'Spread rice evenly on nori' },
          { step: 5, description: 'Add salmon, avocado, and cucumber in a line' },
          { step: 6, description: 'Roll tightly using the bamboo mat' },
          { step: 7, description: 'Slice into 8 pieces with a sharp knife' }
        ],
        prepTime: 30,
        cookTime: 20,
        servings: 4,
        difficulty: 'Hard',
        chef: users[2]._id,
        likes: [users[0]._id, users[4]._id],
        ratings: [
          { user: users[0]._id, rating: 5 },
          { user: users[4]._id, rating: 4 }
        ],
        views: 189,
        isTrending: true,
        isFeatured: true,
        tags: ['sushi', 'japanese', 'seafood']
      },
      {
        title: 'Butter Chicken Curry',
        description: 'Rich and creamy Indian butter chicken with aromatic spices. A restaurant-quality dish you can make at home.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
        cuisine: 'Indian',
        category: 'Dinner',
        ingredients: [
          { name: 'Chicken breast', quantity: '500g' },
          { name: 'Butter', quantity: '4 tbsp' },
          { name: 'Heavy cream', quantity: '1 cup' },
          { name: 'Tomato puree', quantity: '2 cups' },
          { name: 'Garam masala', quantity: '2 tsp' },
          { name: 'Ginger-garlic paste', quantity: '2 tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Marinate chicken in yogurt and spices for 2 hours' },
          { step: 2, description: 'Grill or pan-fry chicken until cooked' },
          { step: 3, description: 'In a pan, melt butter and add ginger-garlic paste' },
          { step: 4, description: 'Add tomato puree and spices, simmer for 10 minutes' },
          { step: 5, description: 'Add cream and cooked chicken' },
          { step: 6, description: 'Simmer for 5 minutes and serve with rice or naan' }
        ],
        prepTime: 130,
        cookTime: 30,
        servings: 4,
        difficulty: 'Medium',
        chef: users[3]._id,
        likes: [users[1]._id, users[5]._id],
        ratings: [
          { user: users[1]._id, rating: 5 }
        ],
        views: 312,
        isTrending: true,
        tags: ['curry', 'indian', 'chicken', 'spicy']
      },
      {
        title: 'Classic Tiramisu',
        description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
        cuisine: 'Italian',
        category: 'Dessert',
        ingredients: [
          { name: 'Ladyfinger cookies', quantity: '24 pieces' },
          { name: 'Mascarpone cheese', quantity: '500g' },
          { name: 'Eggs', quantity: '4' },
          { name: 'Sugar', quantity: '3/4 cup' },
          { name: 'Strong coffee', quantity: '2 cups' },
          { name: 'Cocoa powder', quantity: '2 tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Separate egg yolks and whites' },
          { step: 2, description: 'Beat yolks with sugar until thick' },
          { step: 3, description: 'Fold in mascarpone cheese' },
          { step: 4, description: 'Beat egg whites to stiff peaks and fold in' },
          { step: 5, description: 'Dip ladyfingers in coffee and layer in dish' },
          { step: 6, description: 'Spread mascarpone mixture over ladyfingers' },
          { step: 7, description: 'Repeat layers and dust with cocoa powder' },
          { step: 8, description: 'Refrigerate for at least 4 hours' }
        ],
        prepTime: 30,
        cookTime: 0,
        servings: 8,
        difficulty: 'Medium',
        chef: users[1]._id,
        likes: [users[3]._id, users[4]._id, users[5]._id],
        ratings: [
          { user: users[3]._id, rating: 5 },
          { user: users[4]._id, rating: 5 }
        ],
        views: 156,
        isFeatured: true,
        tags: ['dessert', 'italian', 'coffee']
      },
      {
        title: 'Pad Thai Noodles',
        description: 'Classic Thai street food with rice noodles, shrimp, peanuts, and tamarind sauce.',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
        cuisine: 'Thai',
        category: 'Dinner',
        ingredients: [
          { name: 'Rice noodles', quantity: '200g' },
          { name: 'Shrimp', quantity: '300g' },
          { name: 'Eggs', quantity: '2' },
          { name: 'Bean sprouts', quantity: '1 cup' },
          { name: 'Peanuts', quantity: '1/4 cup' },
          { name: 'Tamarind paste', quantity: '2 tbsp' },
          { name: 'Fish sauce', quantity: '2 tbsp' }
        ],
        instructions: [
          { step: 1, description: 'Soak rice noodles in warm water for 30 minutes' },
          { step: 2, description: 'Heat oil in wok and cook shrimp' },
          { step: 3, description: 'Push shrimp aside and scramble eggs' },
          { step: 4, description: 'Add drained noodles and sauce' },
          { step: 5, description: 'Toss everything together' },
          { step: 6, description: 'Add bean sprouts and peanuts' },
          { step: 7, description: 'Serve with lime wedges' }
        ],
        prepTime: 40,
        cookTime: 15,
        servings: 2,
        difficulty: 'Medium',
        chef: users[2]._id,
        likes: [users[0]._id],
        ratings: [
          { user: users[0]._id, rating: 4 }
        ],
        views: 98,
        tags: ['thai', 'noodles', 'seafood']
      },
      {
        title: 'French Croissants',
        description: 'Buttery, flaky, and perfectly layered French croissants. A labor of love worth every minute.',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
        cuisine: 'French',
        category: 'Breakfast',
        ingredients: [
          { name: 'All-purpose flour', quantity: '4 cups' },
          { name: 'Butter', quantity: '250g' },
          { name: 'Milk', quantity: '1 cup' },
          { name: 'Yeast', quantity: '2 tsp' },
          { name: 'Sugar', quantity: '1/4 cup' },
          { name: 'Salt', quantity: '1 tsp' }
        ],
        instructions: [
          { step: 1, description: 'Make dough and let it rest overnight' },
          { step: 2, description: 'Roll out dough and add butter layer' },
          { step: 3, description: 'Fold and roll multiple times for layers' },
          { step: 4, description: 'Cut into triangles and roll into croissant shape' },
          { step: 5, description: 'Let rise for 2 hours' },
          { step: 6, description: 'Brush with egg wash' },
          { step: 7, description: 'Bake at 400°F for 15-20 minutes' }
        ],
        prepTime: 720,
        cookTime: 20,
        servings: 12,
        difficulty: 'Hard',
        chef: users[1]._id,
        likes: [users[2]._id, users[5]._id],
        ratings: [
          { user: users[2]._id, rating: 5 }
        ],
        views: 203,
        tags: ['french', 'breakfast', 'pastry']
      },
      {
        title: 'Tacos al Pastor',
        description: 'Mexican street tacos with marinated pork, pineapple, and fresh cilantro.',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
        cuisine: 'Mexican',
        category: 'Dinner',
        ingredients: [
          { name: 'Pork shoulder', quantity: '1 kg' },
          { name: 'Pineapple', quantity: '1' },
          { name: 'Corn tortillas', quantity: '12' },
          { name: 'Onion', quantity: '1' },
          { name: 'Cilantro', quantity: '1 bunch' },
          { name: 'Dried chilies', quantity: '4' },
          { name: 'Lime', quantity: '2' }
        ],
        instructions: [
          { step: 1, description: 'Marinate pork in chili paste overnight' },
          { step: 2, description: 'Grill or roast pork until caramelized' },
          { step: 3, description: 'Grill pineapple slices' },
          { step: 4, description: 'Slice pork thinly' },
          { step: 5, description: 'Warm tortillas on griddle' },
          { step: 6, description: 'Assemble tacos with pork, pineapple, onion, and cilantro' },
          { step: 7, description: 'Serve with lime wedges' }
        ],
        prepTime: 720,
        cookTime: 45,
        servings: 6,
        difficulty: 'Medium',
        chef: users[3]._id,
        likes: [users[4]._id],
        ratings: [],
        views: 67,
        tags: ['mexican', 'tacos', 'pork']
      },
      {
        title: 'Greek Moussaka',
        description: 'Layered eggplant casserole with spiced meat sauce and creamy béchamel topping.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        cuisine: 'Mediterranean',
        category: 'Dinner',
        ingredients: [
          { name: 'Eggplant', quantity: '3 large' },
          { name: 'Ground lamb', quantity: '500g' },
          { name: 'Tomato sauce', quantity: '2 cups' },
          { name: 'Milk', quantity: '2 cups' },
          { name: 'Butter', quantity: '4 tbsp' },
          { name: 'Flour', quantity: '1/4 cup' },
          { name: 'Cinnamon', quantity: '1 tsp' }
        ],
        instructions: [
          { step: 1, description: 'Slice and salt eggplant, let drain for 30 minutes' },
          { step: 2, description: 'Grill or bake eggplant slices' },
          { step: 3, description: 'Cook lamb with tomato sauce and spices' },
          { step: 4, description: 'Make béchamel sauce with butter, flour, and milk' },
          { step: 5, description: 'Layer eggplant and meat sauce in baking dish' },
          { step: 6, description: 'Top with béchamel sauce' },
          { step: 7, description: 'Bake at 350°F for 45 minutes' }
        ],
        prepTime: 60,
        cookTime: 45,
        servings: 8,
        difficulty: 'Hard',
        chef: users[1]._id,
        likes: [],
        ratings: [],
        views: 45,
        tags: ['greek', 'mediterranean', 'casserole']
      }
    ]);

    console.log('Created recipes');

    // Calculate ratings for recipes
    for (let recipe of recipes) {
      recipe.calculateAverageRating();
      await recipe.save();
    }

    // Create comments
    await Comment.create([
      {
        recipe: recipes[0]._id,
        user: users[4]._id,
        text: 'This pizza recipe is amazing! The crust came out perfect!',
        likes: [users[1]._id, users[5]._id]
      },
      {
        recipe: recipes[0]._id,
        user: users[5]._id,
        text: 'Made this for dinner tonight. Family loved it! 🍕',
        likes: [users[4]._id]
      },
      {
        recipe: recipes[1]._id,
        user: users[0]._id,
        text: 'Best sushi tutorial I have found. Thank you chef!',
        likes: [users[2]._id]
      },
      {
        recipe: recipes[2]._id,
        user: users[1]._id,
        text: 'The flavors are incredible! Authentic Indian taste.',
        likes: [users[3]._id, users[5]._id]
      },
      {
        recipe: recipes[3]._id,
        user: users[4]._id,
        text: 'Perfect tiramisu! Better than the restaurant version.',
        likes: [users[1]._id]
      }
    ]);

    console.log('Created comments');

    // Create Cook-Off challenge
    await CookOff.create({
      title: 'Summer BBQ Challenge',
      description: 'Show us your best BBQ recipe! Winner gets the BBQ Master badge.',
      theme: 'BBQ & Grilling',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      participants: [
        { user: users[1]._id, recipe: recipes[0]._id, votes: 15 },
        { user: users[2]._id, recipe: recipes[1]._id, votes: 12 },
        { user: users[3]._id, recipe: recipes[2]._id, votes: 18 }
      ],
      isActive: true
    });

    console.log('Created Cook-Off challenge');

    // Set up some follow relationships
    users[4].following.push(users[1]._id, users[2]._id, users[3]._id);
    users[5].following.push(users[1]._id, users[3]._id);
    users[1].followers.push(users[4]._id, users[5]._id);
    users[2].followers.push(users[4]._id);
    users[3].followers.push(users[4]._id, users[5]._id);

    // Set up bookmarks
    users[4].bookmarks.push(recipes[0]._id, recipes[1]._id, recipes[3]._id);
    users[5].bookmarks.push(recipes[0]._id, recipes[2]._id);

    // Save users with relationships
    await Promise.all(users.map(user => user.save()));

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@craveconnect.com / admin123');
    console.log('Chef: maria@example.com / password123');
    console.log('Chef: takeshi@example.com / password123');
    console.log('Chef: raj@example.com / password123');
    console.log('Foodie: sarah@example.com / password123');
    console.log('Foodie: mike@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
