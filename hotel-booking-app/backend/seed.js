require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Place = require('./models/Place');

const seedData = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB for seeding...");

    // 2. Clear existing places (optional: comment out if you want to keep existing ones)
    // await Place.deleteMany({});
    
    // 3. Create a dummy admin user if it doesn't exist
    let adminUser = await User.findOne({ email: 'admin@hotelbazaar.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'Admin Host',
        email: 'admin@hotelbazaar.com',
        password: hashedPassword,
      });
      console.log("Created admin user.");
    }

    // 4. Dummy hotel data
    const places = [
      {
        owner: adminUser._id,
        title: 'Luxurious Oceanfront Villa',
        address: '123 Coastal Highway, Malibu, CA',
        photos: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80'
        ],
        description: 'Experience the ultimate luxury at this stunning oceanfront villa. Features panoramic views, private pool, and direct beach access.',
        perks: ['wifi', 'parking', 'tv', 'radio', 'pets', 'entrance'],
        extraInfo: 'No parties allowed. Quiet hours after 10 PM.',
        checkIn: '15:00',
        checkOut: '11:00',
        maxGuests: 6,
        price: 850
      },
      {
        owner: adminUser._id,
        title: 'Cozy Mountain Cabin Retreat',
        address: '45 Pine Ridge, Aspen, CO',
        photos: [
          'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1565&q=80',
          'https://images.unsplash.com/photo-1542314831-c6a4d1409385?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        ],
        description: 'Escape to the mountains in this charming log cabin. Complete with a roaring fireplace, hot tub, and ski-in/ski-out access.',
        perks: ['wifi', 'parking', 'tv'],
        extraInfo: '4WD vehicle recommended in winter.',
        checkIn: '14:00',
        checkOut: '10:00',
        maxGuests: 4,
        price: 320
      },
      {
        owner: adminUser._id,
        title: 'Modern Downtown Penthouse',
        address: '88 Skyline Ave, New York, NY',
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        ],
        description: 'Sleek and stylish penthouse right in the heart of the city. Walking distance to premium dining and shopping.',
        perks: ['wifi', 'tv', 'entrance'],
        extraInfo: 'Gym and pool access included in the building.',
        checkIn: '16:00',
        checkOut: '12:00',
        maxGuests: 2,
        price: 550
      },
      {
        owner: adminUser._id,
        title: 'Tropical Jungle Treehouse',
        address: '77 Canopy Lane, Tulum, Mexico',
        photos: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        ],
        description: 'Immerse yourself in nature in this breathtaking treehouse. Features an outdoor shower and stunning jungle views.',
        perks: ['wifi', 'pets'],
        extraInfo: 'Eco-friendly property. Solar powered.',
        checkIn: '14:00',
        checkOut: '11:00',
        maxGuests: 3,
        price: 210
      }
    ];

    await Place.insertMany(places);
    console.log(`Successfully added ${places.length} new places!`);

    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedData();
