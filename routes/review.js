// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");

// //validation
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };
// //review (post route)
// router.post("/", validateReview, wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New review added successfully");
//     res.redirect(`/listings/${listing._id}`);
// }));

// //delete review route
// router.delete("/:reviewId", wrapAsync(async(req, res) => {
//     let {id, reviewId} = req.params;

//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "review deleted successfully");
//     res.redirect(`/listings/${id}`);
// }));

// module.exports = router;







const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Middleware to validate review schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Create review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review added successfully");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;