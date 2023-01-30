import jwt from "jsonwebtoken";

import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});

export const authorizeSubscribers = (req, res, next) => {
  if (
    (req.user.subscription.status !== "active" && req.user.role !== "admin") ||
    (req.user.subscription.status !== "trialing" && req.user.role !== "admin")
  )
    return next(
      new ErrorHandler(`Only Subscribers can access this resource`, 403)
    );

  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );

  next();
};
