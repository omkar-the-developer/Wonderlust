const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.mapToken; // Store your token in .env
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    const response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();

    try {
        const response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            })
            .send();

        if (!req.file) {
            req.flash("error", "Image file is mandatory. Try again with your property image");
            return res.redirect("/listings/new");
        }

        const url = req.file.path;
        const filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        await newListing.save();
        req.flash("success", "New listing added successfully");
        res.redirect("/listings");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings");
    }
};



module.exports.editForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_200,c_fill");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, mapToken: process.env.mapToken });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};