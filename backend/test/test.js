const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Hotel Reservation API Tests', () => {
  let testRoomId;
  let testReservationId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/hotel_reservations_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    
    const room = new app.locals.Room({
      roomNumber: '101',
      type: 'double',
      price: 150,
      description: 'Comfortable double room',
      amenities: ['TV', 'WiFi', 'Air Conditioning'],
      maxGuests: 2,
      available: true
    });
    
    const savedRoom = await room.save();
    testRoomId = savedRoom._id;
  });

  describe('Health Check', () => {
    it('should return API health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Hotel Reservation API is running');
    });
  });

  describe('Rooms Management', () => {
    it('should get all rooms', async () => {
      const response = await request(app).get('/api/rooms');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it('should get room by ID', async () => {
      const response = await request(app).get(`/api/rooms/${testRoomId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.roomNumber).toBe('101');
      expect(response.body.type).toBe('double');
    });

    it('should filter rooms by type', async () => {
      const response = await request(app).get('/api/rooms?type=double');
      
      expect(response.status).toBe(200);
      expect(response.body[0].type).toBe('double');
    });

    it('should return 404 for non-existent room', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/rooms/${fakeId}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('Reservations Management', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        roomId: testRoomId.toString(),
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        numberOfGuests: 2,
        specialRequests: 'Early check-in please'
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      expect(response.status).toBe(201);
      expect(response.body.guestName).toBe(reservationData.guestName);
      expect(response.body.status).toBe('pending');
      expect(response.body.totalPrice).toBe(300);

      testReservationId = response.body._id;
    });

    it('should not create reservation for unavailable room', async () => {
      const room = new app.locals.Room({
        roomNumber: '102',
        type: 'single',
        price: 100,
        description: 'Single room',
        maxGuests: 1,
        available: false
      });
      const unavailableRoom = await room.save();

      const reservationData = {
        guestName: 'Jane Doe',
        guestEmail: 'jane@example.com',
        guestPhone: '+1234567891',
        roomId: unavailableRoom._id.toString(),
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        numberOfGuests: 1
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Room is not available');
    });

    it('should get reservations by email', async () => {
      const reservationData = {
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        roomId: testRoomId.toString(),
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        numberOfGuests: 2
      };

      await request(app).post('/api/reservations').send(reservationData);

      const response = await request(app)
        .get('/api/reservations?email=john@example.com');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].guestEmail).toBe('john@example.com');
    });

    it('should update reservation status', async () => {
      const reservationData = {
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        roomId: testRoomId.toString(),
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        numberOfGuests: 2
      };

      const createResponse = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      const reservationId = createResponse.body._id;

      const updateResponse = await request(app)
        .put(`/api/reservations/${reservationId}/status`)
        .send({ status: 'confirmed' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('confirmed');
    });
  });

  describe('Availability Check', () => {
    it('should check room availability', async () => {
      const response = await request(app)
        .get('/api/rooms/available/2024-01-15/2024-01-17');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Dashboard Statistics', () => {
    it('should get dashboard stats', async () => {
      const response = await request(app).get('/api/dashboard/stats');

      expect(response.status).toBe(200);
      expect(response.body.totalRooms).toBeDefined();
      expect(response.body.availableRooms).toBeDefined();
      expect(response.body.totalReservations).toBeDefined();
    });
  });
});