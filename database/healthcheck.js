const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservations';

async function checkDatabaseHealth() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    const db = mongoose.connection;
    
    const adminDb = db.db.admin();
    const serverStatus = await adminDb.serverStatus();
    
    const roomsCount = await mongoose.connection.db.collection('rooms').countDocuments();
    const reservationsCount = await mongoose.connection.db.collection('reservations').countDocuments();
    
    await mongoose.connection.close();
    
    console.log(JSON.stringify({
      status: 'healthy',
      database: 'connected',
      server_version: serverStatus.version,
      collections: {
        rooms: roomsCount,
        reservations: reservationsCount
      },
      timestamp: new Date().toISOString()
    }));
    
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }));
    
    process.exit(1);
  }
}

if (require.main === module) {
  checkDatabaseHealth();
}

module.exports = { checkDatabaseHealth };