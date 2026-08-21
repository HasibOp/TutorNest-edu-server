const reviewServices = require('../services/reviewServices');
const bookingServices = require('../services/bookingServices');
const userServices = require('../services/userServices');

const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const studentEmail = req.decoded.email;

    const numericRating = Number(rating);
    const isHalfStep = Number.isFinite(numericRating) && (numericRating * 2) % 1 === 0;
    if (!bookingId || !isHalfStep || numericRating < 1 || numericRating > 5) {
      return res.status(400).send({ message: 'a booking and a rating from 1 to 5 (in half-star steps) are required' });
    }

    const booking = await bookingServices.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).send({ message: 'booking not found' });
    }
    if (booking.studentEmail !== studentEmail) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).send({ message: 'you can only review a completed session' });
    }

    const existing = await reviewServices.getReviewByBookingId(bookingId);
    if (existing) {
      return res.status(409).send({ message: 'you already reviewed this session' });
    }

    const student = await userServices.getUserByEmail(studentEmail);

    const result = await reviewServices.createReview({
      bookingId,
      studentEmail,
      studentName: student?.name || '',
      studentPhoto: student?.photo || '',
      tutorEmail: booking.tutorEmail,
      rating: numericRating,
      comment: comment || '',
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to submit review' });
  }
};

const getTutorReviews = async (req, res) => {
  try {
    const [reviews, summary] = await Promise.all([
      reviewServices.getReviewsByTutor(req.params.email),
      reviewServices.getTutorRatingSummary(req.params.email),
    ]);
    res.send({ reviews, ...summary });
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch reviews' });
  }
};

module.exports = {
  createReview,
  getTutorReviews,
};
