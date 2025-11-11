db = db.getSiblingDB('hotel_reservations');

db.createCollection('rooms');
db.createCollection('reservations');

db.rooms.createIndex({ "roomNumber": 1 }, { unique: true });
db.rooms.createIndex({ "type": 1 });
db.rooms.createIndex({ "price": 1 });
db.rooms.createIndex({ "available": 1 });

db.reservations.createIndex({ "guestEmail": 1 });
db.reservations.createIndex({ "room": 1 });
db.reservations.createIndex({ "checkIn": 1, "checkOut": 1 });
db.reservations.createIndex({ "status": 1 });
db.reservations.createIndex({ "paymentStatus": 1 });

db.rooms.insertMany([
  {
    roomNumber: "101",
    type: "single",
    price: 89.99,
    description: "Comfortable single room with city view",
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Work Desk"],
    maxGuests: 1,
    available: true,
    images: ["room101-1.jpg", "room101-2.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "102",
    type: "single",
    price: 99.99,
    description: "Deluxe single room with balcony",
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Work Desk", "Balcony", "Mini Bar"],
    maxGuests: 1,
    available: true,
    images: ["room102-1.jpg", "room102-2.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "201",
    type: "double",
    price: 149.99,
    description: "Spacious double room perfect for couples",
    amenities: ["Free WiFi", "TV", "Air Conditioning", "King Size Bed", "Coffee Maker"],
    maxGuests: 2,
    available: true,
    images: ["room201-1.jpg", "room201-2.jpg", "room201-3.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "202",
    type: "double",
    price: 169.99,
    description: "Double room with garden view",
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Queen Size Bed", "Coffee Maker", "Balcony"],
    maxGuests: 2,
    available: true,
    images: ["room202-1.jpg", "room202-2.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "301",
    type: "suite",
    price: 249.99,
    description: "Luxury suite with separate living area",
    amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "King Size Bed", "Living Room", "Mini Bar", "Jacuzzi"],
    maxGuests: 3,
    available: true,
    images: ["room301-1.jpg", "room301-2.jpg", "room301-3.jpg", "room301-4.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "302",
    type: "suite",
    price: 299.99,
    description: "Executive suite with panoramic city views",
    amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "King Size Bed", "Living Room", "Mini Bar", "Jacuzzi", "Balcony"],
    maxGuests: 4,
    available: true,
    images: ["room302-1.jpg", "room302-2.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    roomNumber: "401",
    type: "deluxe",
    price: 399.99,
    description: "Presidential deluxe suite with premium amenities",
    amenities: ["Free WiFi", "Smart TV", "Air Conditioning", "California King Bed", "Living Room", "Dining Area", "Full Bar", "Jacuzzi", "Balcony", "Butler Service"],
    maxGuests: 4,
    available: true,
    images: ["room401-1.jpg", "room401-2.jpg", "room401-3.jpg", "room401-4.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.reservations.insertMany([
  {
    guestName: "Carlos Rodriguez",
    guestEmail: "carlos.rodriguez@email.com",
    guestPhone: "+1-555-0201",
    room: db.rooms.findOne({roomNumber: "201"})._id,
    checkIn: new Date("2024-02-01"),
    checkOut: new Date("2024-02-03"),
    numberOfGuests: 2,
    totalPrice: 299.98,
    status: "confirmed",
    specialRequests: "Honeymoon suite decoration",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    guestName: "Laura Martinez",
    guestEmail: "laura.martinez@email.com",
    guestPhone: "+1-555-0202",
    room: db.rooms.findOne({roomNumber: "301"})._id,
    checkIn: new Date("2024-02-05"),
    checkOut: new Date("2024-02-07"),
    numberOfGuests: 2,
    totalPrice: 499.98,
    status: "pending",
    specialRequests: "Business trip - need early check-in",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    guestName: "Robert Wilson",
    guestEmail: "robert.wilson@email.com",
    guestPhone: "+1-555-0203",
    room: db.rooms.findOne({roomNumber: "102"})._id,
    checkIn: new Date("2024-02-10"),
    checkOut: new Date("2024-02-12"),
    numberOfGuests: 1,
    totalPrice: 199.98,
    status: "confirmed",
    specialRequests: "Quiet room preferred",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    guestName: "Sarah Chen",
    guestEmail: "sarah.chen@email.com",
    guestPhone: "+1-555-0204",
    room: db.rooms.findOne({roomNumber: "401"})._id,
    checkIn: new Date("2024-02-15"),
    checkOut: new Date("2024-02-17"),
    numberOfGuests: 3,
    totalPrice: 799.98,
    status: "completed",
    specialRequests: "Birthday celebration with champagne",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialization completed successfully!");

print("\nRoom Count: " + db.rooms.countDocuments());
print("Reservation Count: " + db.reservations.countDocuments());

print("\nSample Room Data:");
db.rooms.find({}, {roomNumber: 1, type: 1, price: 1, available: 1}).forEach(printjson);

print("\nSample Reservation Data:");
db.reservations.find({}, {guestName: 1, room: 1, checkIn: 1, checkOut: 1, status: 1, totalPrice: 1}).forEach(printjson);