const mongoose = require('mongoose');
require('dotenv').config();

const Room = require('../backend/models/Room');
const Reservation = require('../backend/models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservations';

const sampleRooms = [
  {
    roomNumber: '101',
    type: 'single',
    price: 89.99,
    description: 'Comfortable single room with city view',
    amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Work Desk'],
    maxGuests: 1,
    available: true,
    images: ['room101-1.jpg', 'room101-2.jpg']
  },
  {
    roomNumber: '102',
    type: 'single',
    price: 99.99,
    description: 'Deluxe single room with balcony',
    amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Work Desk', 'Balcony', 'Mini Bar'],
    maxGuests: 1,
    available: true,
    images: ['room102-1.jpg', 'room102-2.jpg']
  },
  {
    roomNumber: '201',
    type: 'double',
    price: 149.99,
    description: 'Spacious double room perfect for couples',
    amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'King Size Bed', 'Coffee Maker'],
    maxGuests: 2,
    available: true,
    images: ['room201-1.jpg', 'room201-2.jpg', 'room201-3.jpg']
  },
  {
    roomNumber: '202',
    type: 'double',
    price: 169.99,
    description: 'Double room with garden view',
    amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Queen Size Bed', 'Coffee Maker', 'Balcony'],
    maxGuests: 2,
    available: true,
    images: ['room202-1.jpg', 'room202-2.jpg']
  },
  {
    roomNumber: '301',
    type: 'suite',
    price: 249.99,
    description: 'Luxury suite with separate living area',
    amenities: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'King Size Bed', 'Living Room', 'Mini Bar', 'Jacuzzi'],
    maxGuests: 3,
    available: true,
    images: ['room301-1.jpg', 'room301-2.jpg', 'room301-3.jpg', 'room301-4.jpg']
  },
  {
    roomNumber: '302',
    type: 'suite',
    price: 299.99,
    description: 'Executive suite with panoramic city views',
    amenities: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'King Size Bed', 'Living Room', 'Mini Bar', 'Jacuzzi', 'Balcony'],
    maxGuests: 4,
    available: true,
    images: ['room302-1.jpg', 'room302-2.jpg']
  },
  {
    roomNumber: '401',
    type: 'deluxe',
    price: 399.99,
    description: 'Presidential deluxe suite with premium amenities',
    amenities: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'California King Bed', 'Living Room', 'Dining Area', 'Full Bar', 'Jacuzzi', 'Balcony', 'Butler Service'],
    maxGuests: 4,
    available: true,
    images: ['room401-1.jpg', 'room401-2.jpg', 'room401-3.jpg', 'room401-4.jpg']
  },
  {
    roomNumber: '103',
    type: 'single',
    price: 79.99,
    description: 'Economy single room',
    amenities: ['Free WiFi', 'TV', 'Air Conditioning'],
    maxGuests: 1,
    available: false,
    images: ['room103-1.jpg']
  }
];

const sampleReservations = [
  {
    guestName: 'Maria Gonzalez',
    guestEmail: 'maria.gonzalez@email.com',
    guestPhone: '+1-555-0101',
    room: null,
    checkIn: new Date('2024-01-10'),
    checkOut: new Date('2024-01-12'),
    numberOfGuests: 2,
    totalPrice: 299.98,
    status: 'completed',
    specialRequests: 'Late check-out if possible',
    paymentStatus: 'paid'
  },
  {
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1-555-0102',
    room: null,
    checkIn: new Date('2024-01-15'),
    checkOut: new Date('2024-01-18'),
    numberOfGuests: 1,
    totalPrice: 269.97,
    status: 'confirmed',
    specialRequests: 'High floor preferred',
    paymentStatus: 'paid'
  },
  {
    guestName: 'Anna Johnson',
    guestEmail: 'anna.johnson@email.com',
    guestPhone: '+1-555-0103',
    room: null,
    checkIn: new Date('2024-01-20'),
    checkOut: new Date('2024-01-22'),
    numberOfGuests: 2,
    totalPrice: 499.98,
    status: 'pending',
    specialRequests: 'Anniversary celebration',
    paymentStatus: 'pending'
  }
];

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    console.log('Dropping existing collections...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    console.log('Creating rooms...');
    const createdRooms = await Room.insertMany(sampleRooms);
    console.log(`Created ${createdRooms.length} rooms`);

    console.log('Creating reservations...');
    const reservationsWithRooms = sampleReservations.map((reservation, index) => ({
      ...reservation,
      room: createdRooms[index % createdRooms.length]._id
    }));

    const createdReservations = await Reservation.insertMany(reservationsWithRooms);
    console.log(`Created ${createdReservations.length} reservations`);

    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          available: { $sum: { $cond: ['$available', 1, 0] } }
        }
      }
    ]);

    console.log('\nRoom Statistics:');
    roomStats.forEach(stat => {
      console.log(`Type: ${stat._id}, Count: ${stat.count}, Available: ${stat.available}, Avg Price: $${stat.avgPrice.toFixed(2)}`);
    });

    const reservationStats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    console.log('\nReservation Statistics:');
    reservationStats.forEach(stat => {
      console.log(`Status: ${stat._id}, Count: ${stat.count}, Revenue: $${stat.totalRevenue.toFixed(2)}`);
    });

    const totalRevenue = await Reservation.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    console.log(`\nTotal Revenue from paid reservations: $${totalRevenue[0]?.total.toFixed(2) || '0.00'}`);

    console.log('\nDatabase initialization completed successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, sampleRooms, sampleReservations };