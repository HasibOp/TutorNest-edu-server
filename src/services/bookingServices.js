const { client, isValidObjectId } = require('../../config/db');
const { ObjectId } = require('mongodb');

const bookingsCollection = () => client.db('tutorNestDB').collection('bookings');

const getBookingsByStudent = async (studentEmail) => {
  return bookingsCollection().find({ studentEmail }).sort({ date: 1, startTime: 1 }).toArray();
};

const getBookingsByTutor = async (tutorEmail) => {
  return bookingsCollection().find({ tutorEmail }).sort({ date: 1, startTime: 1 }).toArray();
};

const getAllBookings = async () => {
  return bookingsCollection().find().sort({ createdAt: -1 }).toArray();
};

const findConflict = async ({ tutorEmail, date, startTime }) => {
  return bookingsCollection().findOne({
    tutorEmail,
    date,
    startTime,
    status: 'confirmed',
  });
};

const createBooking = async (booking) => {
  const doc = {
    ...booking,
    status: 'confirmed',
    createdAt: new Date(),
  };
  return bookingsCollection().insertOne(doc);
};

const getBookingById = async (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return bookingsCollection().findOne({ _id: new ObjectId(id) });
};

const updateBookingStatus = async (id, status) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return bookingsCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
};

module.exports = {
  getBookingsByStudent,
  getBookingsByTutor,
  getAllBookings,
  findConflict,
  createBooking,
  getBookingById,
  updateBookingStatus,
};
