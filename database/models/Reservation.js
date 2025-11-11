const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  guestEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  guestPhone: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

ReservationSchema.index({ guestEmail: 1 });
ReservationSchema.index({ room: 1 });
ReservationSchema.index({ checkIn: 1, checkOut: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ paymentStatus: 1 });

ReservationSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

ReservationSchema.methods.toJSON = function() {
  const reservation = this.toObject();
  reservation.id = reservation._id;
  delete reservation._id;
  delete reservation.__v;
  return reservation;
};

module.exports = mongoose.model('Reservation', ReservationSchema);