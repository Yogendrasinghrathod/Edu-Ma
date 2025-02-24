const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserSchema");

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
	
    try {
        // Extract token from different possible locations
        const token = req.cookies?.token || 
                     req.header("Authorization")?.replace("Bearer ", "") || 
                     req.body?.token;
        
        // Check if token exists
        if (!token) {
             return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        
        // Set user info in request
        req.user = decoded;

		
		// console.log(req.user);
        
        // Move to next middleware
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid"
        });
    }
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		// console.log(userDetails);

		// console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
	}
};

