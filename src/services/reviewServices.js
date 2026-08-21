const { client } = require('../../config/db');

const reviewsCollection = () => client.db('tutorNestDB').collection('reviews');

const getReviewsByTutor = async (tutorEmail) => {
  return reviewsCollection().find({ tutorEmail }).sort({ createdAt: -1 }).toArray();
};

const getReviewByBookingId = async (bookingId) => {
  return reviewsCollection().findOne({ bookingId });
};

const getReviewedBookingIds = async (bookingIds) => {
  const reviews = await reviewsCollection()
    .find({ bookingId: { $in: bookingIds } }, { projection: { bookingId: 1 } })
    .toArray();
  return new Set(reviews.map((r) => r.bookingId));
};

const createReview = async (review) => {
  const doc = {
    ...review,
    createdAt: new Date(),
  };
  return reviewsCollection().insertOne(doc);
};

const getTutorRatingSummary = async (tutorEmail) => {
  const [summary] = await reviewsCollection()
    .aggregate([
      { $match: { tutorEmail } },
      {
        $group: {
          _id: '$tutorEmail',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return {
    averageRating: summary ? Math.round(summary.averageRating * 10) / 10 : 0,
    totalReviews: summary?.totalReviews || 0,
  };
};

const getRatingSummariesByTutors = async (tutorEmails) => {
  const summaries = await reviewsCollection()
    .aggregate([
      { $match: { tutorEmail: { $in: tutorEmails } } },
      {
        $group: {
          _id: '$tutorEmail',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return summaries.reduce((map, s) => {
    map[s._id] = {
      averageRating: Math.round(s.averageRating * 10) / 10,
      totalReviews: s.totalReviews,
    };
    return map;
  }, {});
};

module.exports = {
  getReviewsByTutor,
  getReviewByBookingId,
  getReviewedBookingIds,
  createReview,
  getTutorRatingSummary,
  getRatingSummariesByTutors,
};
