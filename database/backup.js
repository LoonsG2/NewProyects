const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Room = require('../backend/models/Room');
const Reservation = require('../backend/models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservations';
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

async function createBackup() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    console.log('Connecting to MongoDB for backup...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `hotel-backup-${timestamp}.json`);

    console.log('Fetching data...');
    const rooms = await Room.find({});
    const reservations = await Reservation.find({}).populate('room');

    const backupData = {
      timestamp: new Date().toISOString(),
      database: 'hotel_reservations',
      rooms: rooms.map(room => room.toObject()),
      reservations: reservations.map(res => ({
        ...res.toObject(),
        room: res.room ? res.room._id : null
      }))
    };

    console.log('Writing backup file...');
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    const stats = {
      rooms: rooms.length,
      reservations: reservations.length,
      fileSize: (fs.statSync(backupFile).size / 1024 / 1024).toFixed(2) + ' MB',
      backupFile: backupFile
    };

    console.log('Backup completed successfully:');
    console.log(stats);

    await mongoose.connection.close();

    return stats;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

async function restoreBackup(backupFile) {
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    console.log('Reading backup file...');
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    console.log('Connecting to MongoDB for restore...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Dropping existing collections...');
    await mongoose.connection.db.dropDatabase();

    console.log('Restoring rooms...');
    await Room.insertMany(backupData.rooms);

    console.log('Restoring reservations...');
    await Reservation.insertMany(backupData.reservations);

    const stats = {
      rooms: backupData.rooms.length,
      reservations: backupData.reservations.length,
      backupDate: backupData.timestamp
    };

    console.log('Restore completed successfully:');
    console.log(stats);

    await mongoose.connection.close();

    return stats;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}

async function listBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('hotel-backup-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: filePath,
          size: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
          created: stats.birthtime
        };
      })
      .sort((a, b) => b.created - a.created);

    return files;
  } catch (error) {
    console.error('Error listing backups:', error);
    throw error;
  }
}

if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'backup':
      createBackup();
      break;
    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('Please specify backup file: node backup.js restore <backup-file>');
        process.exit(1);
      }
      restoreBackup(backupFile);
      break;
    case 'list':
      listBackups().then(backups => {
        console.log('Available backups:');
        backups.forEach(backup => {
          console.log(`- ${backup.filename} (${backup.size}) - ${backup.created}`);
        });
      });
      break;
    default:
      console.log('Usage:');
      console.log('  node backup.js backup        - Create a new backup');
      console.log('  node backup.js restore <file> - Restore from backup file');
      console.log('  node backup.js list          - List available backups');
      process.exit(1);
  }
}

module.exports = {
  createBackup,
  restoreBackup,
  listBackups
};