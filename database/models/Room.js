const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  available: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

RoomSchema.index({ type: 1, price: 1 });
RoomSchema.index({ available: 1 });
RoomSchema.index({ roomNumber: 1 });

RoomSchema.methods.toJSON = function() {
  const room = this.toObject();
  room.id = room._id;
  delete room._id;
  delete room.__v;
  return room;
};

module.exports = mongoose.model('Room', RoomSchema);