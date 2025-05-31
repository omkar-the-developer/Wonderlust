const User = require("../models/user")

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            };
        req.flash("success", "Congrats!  Welcome to WonderLust");
        res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
        req.flash("success", "Welcome back to WonderLust! You're Logged In");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success", "You're Loged Out now!");
        res.redirect("/listings");
    });
};