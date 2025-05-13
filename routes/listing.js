// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
// const Listing = require("../models/listing.js");

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// //index route
// router.get("/", wrapAsync(async(req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//     }));

// //new listing
// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// //create route
// router.post("/", validateListing, wrapAsync(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     req.flash("success", "New listing added successfully");
//     res.redirect("/listings");
// }));


// //Edit route
// router.get("/:id/edit", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));

// //Update route
// router.put("/:id", validateListing, wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     req.flash("success", "Listing updated successfully");
//     res.redirect("/listings"); 
// }));

// //Delete route
// router.delete("/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     req.flash("success", "Listing deleted successfully");
//     res.redirect("/listings");
// }));

// //show route
// router.get("/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// }));

// module.exports = router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// Middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// GET: All listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// GET: New listing form
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// POST: Create listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing added successfully");
    res.redirect("/listings");
}));

// GET: Edit form
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// PUT: Update listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!updatedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing updated successfully");
    res.redirect("/listings");
}));

// DELETE: Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}));

// GET: Show one listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

module.exports = router;