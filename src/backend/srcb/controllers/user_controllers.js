import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// Common options for cookies. This is the key change.
// 'secure' is set to true only in production, allowing login on http://localhost
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "Username, email, and password are required");
    }

    const foundUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (foundUserByEmail) {
      throw new ApiError(400, "A user with this email address already exists.");
    }

    const foundUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (foundUserByUsername) {
      throw new ApiError(400, "A user with this username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        age: 0,
        location: "Not provided",
        occupation: "Not provided",
        investment_experience: "BEGINNER",
      },
    });
    
    // Do not send password back in response
    const { password: _, ...createdUser } = user;
    const token = generateAccessToken(user.id);

    return res.status(201).json(
      new ApiResponse(200, { user: createdUser, token }, "User registered successfully")
    );
  } catch (error) {
    next(error);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError(404, "User with this email does not exist");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        const { password: _, ...loggedInUser } = user;

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
    } catch (error) {
        next(error);
    }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(new ApiError(400, error.message || "Error occurred while logging out the user."));
  }
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new ApiError(401, "Unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decodedToken?.id } });

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Access token refreshed")
      );
  } catch (error) {
    next(new ApiError(401, "Invalid refresh token"));
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
          throw new ApiError(400, "Old and new passwords are required");
        }
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid old password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
    } catch(error) {
        next(error);
    }
});

const getUser = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user) {
          throw new ApiError(404, "User not found");
        }
        const { password: _, ...userWithoutPassword } = req.user;
        return res.status(200).json(new ApiResponse(200, userWithoutPassword, "User fetched successfully"));
    } catch(error) {
        next(error);
    }
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, age, location, occupation, investment_experience } = req.body;
        const updatedUser = await prisma.user.update({
          where: { id: req.user.id },
          data: { username, email, age, location, occupation, investment_experience },
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        return res.status(200).json(new ApiResponse(200, userWithoutPassword, "User details updated successfully"));
    } catch(error) {
        next(error);
    }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getUser, updateUserDetails };

