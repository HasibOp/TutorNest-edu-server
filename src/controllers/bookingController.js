const bookingServices = require('../services/bookingServices');
const tutorProfileServices = require('../services/tutorProfileServices');
const userServices = require('../services/userServices');
const reviewServices = require('../services/reviewServices');

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const createBooking = async (req, res) => {
  try {
    const { tutorProfileId, date, day, startTime, endTime, subject } = req.body;
    const studentEmail = req.decoded.email;

    if (!tutorProfileId || !date || !day || !startTime || !endTime) {
      return res.status(400).send({ message: 'missing booking details' });
    }

    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime()) || WEEKDAYS[parsedDate.getDay()] !== day) {
      return res.status(400).send({ message: 'date does not match the selected day' });
    }

    const tutorProfile = await tutorProfileServices.getProfileById(tutorProfileId);
    if (!tutorProfile) {
      return res.status(404).send({ message: 'tutor profile not found' });
    }

    const slotExists = tutorProfile.availability?.some(
      (slot) => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
    );
    if (!slotExists) {
      return res.status(400).send({ message: 'selected slot is not available' });
    }

    if (tutorProfile.userEmail === studentEmail) {
      return res.status(400).send({ message: "you can't book your own session" });
    }

    const conflict = await bookingServices.findConflict({
      tutorEmail: tutorProfile.userEmail,
      date,
      startTime,
    });
    if (conflict) {
      return res.status(409).send({ message: 'this slot has already been booked' });
    }

    const student = await userServices.getUserByEmail(studentEmail);

    const result = await bookingServices.createBooking({
      studentEmail,
      studentName: student?.name || '',
      tutorEmail: tutorProfile.userEmail,
      tutorName: tutorProfile.name || '',
      tutorProfileId,
      categoryName: tutorProfile.categoryName || '',
      subject: subject || '',
      date,
      day,
      startTime,
      endTime,
      hourlyRate: tutorProfile.hourlyRate || 0,
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to create booking' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await userServices.getUserByEmail(email);
    const isTutor = user?.role === 'tutor';

    const bookings = isTutor
      ? await bookingServices.getBookingsByTutor(email)
      : await bookingServices.getBookingsByStudent(email);

    if (isTutor) {
      return res.send(bookings);
    }

    const completedIds = bookings
      .filter((b) => b.status === 'completed')
      .map((b) => String(b._id));
    const reviewedIds = await reviewServices.getReviewedBookingIds(completedIds);

    const enriched = bookings.map((b) => ({
      ...b,
      reviewed: reviewedIds.has(String(b._id)),
    }));

    res.send(enriched);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).send({ message: 'invalid status' });
    }

    const booking = await bookingServices.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).send({ message: 'booking not found' });
    }

    const email = req.decoded.email;
    const isTutor = booking.tutorEmail === email;
    const isStudent = booking.studentEmail === email;

    if (!isTutor && !isStudent) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    if (status === 'completed' && !isTutor) {
      return res.status(403).send({ message: 'only the tutor can mark a session complete' });
    }
    if (status === 'completed' && booking.status !== 'confirmed') {
      return res.status(400).send({ message: 'this booking can no longer be updated' });
    }
    if (status === 'cancelled' && !['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).send({ message: 'this booking can no longer be updated' });
    }

    const result = await bookingServices.updateBookingStatus(req.params.id, status);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to update booking' });
  }
};

const MAX_CONFIRMATION_MESSAGE_LENGTH = 1000;

const confirmBooking = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).send({ message: 'a message with the session details (e.g. a Google Meet link or location) is required' });
    }
    if (message.length > MAX_CONFIRMATION_MESSAGE_LENGTH) {
      return res.status(400).send({ message: 'message is too long' });
    }

    const booking = await bookingServices.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).send({ message: 'booking not found' });
    }

    const email = req.decoded.email;
    if (booking.tutorEmail !== email) {
      return res.status(403).send({ message: 'only the tutor can confirm this booking' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).send({ message: 'this booking can no longer be confirmed' });
    }

    const result = await bookingServices.confirmBooking(req.params.id, message.trim());
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to confirm booking' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingServices.getAllBookings();
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch bookings' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  confirmBooking,
};
