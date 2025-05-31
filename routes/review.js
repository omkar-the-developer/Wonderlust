const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Create review
router.post("/", validateReview, isLoggedin, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;