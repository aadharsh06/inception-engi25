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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
        return res.status(200).json(new ApiResponse( userWithoutPassword, 200, "User fetched successfully"));
    } catch(error) {
        next(error);
    }
});
const updateUserDetails = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, investmentPrefs } = req.body;

    if (!investmentPrefs) {
      return res.status(400).json({ message: "investmentPrefs missing" });
    }

    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
    });

   
    const {
      age,
      location,
      occupation,
      investment_experience,
      goal_type,
      target_amount,
      target_years,
      risk_tolerance,
      volatility_tolerance,
      initial_investment,
      liquidity_needs_percentage,
      preferred_sectors,
      excluded_sectors,
      portfolioStyle,
    } = investmentPrefs;

    const upsertPrefs = await prisma.investmentPrefs.upsert({
      where: { userId },
      create: {
        userId,
        portfolio_style: portfolioStyle,
        age: parseInt(age),
        location,
        occupation,
        investment_experience: investment_experience.toUpperCase(),
        goal_type: goal_type.toUpperCase(),
        target_amount: parseFloat(target_amount),
        target_years: parseInt(target_years),
        risk_tolerance: risk_tolerance.toUpperCase(),
        volatility_tolerance: volatility_tolerance.toUpperCase(),
        initial_investment: parseFloat(initial_investment),
        liquidity_needs_percentage: parseFloat(liquidity_needs_percentage),
        preferred_sectors: Array.isArray(preferred_sectors)
          ? preferred_sectors
          : (preferred_sectors?.split(",").map(s => s.trim()) || []),
        excluded_sectors: Array.isArray(excluded_sectors)
          ? excluded_sectors
          : (excluded_sectors?.split(",").map(s => s.trim()) || []),
      },
      update: {
        portfolio_style: portfolioStyle,
        age: parseInt(age),
        location,
        occupation,
        investment_experience: investment_experience.toUpperCase(),
        goal_type: goal_type.toUpperCase(),
        target_amount: parseFloat(target_amount),
        target_years: parseInt(target_years),
        risk_tolerance: risk_tolerance.toUpperCase(),
        volatility_tolerance: volatility_tolerance.toUpperCase(),
        initial_investment: parseFloat(initial_investment),
        liquidity_needs_percentage: parseFloat(liquidity_needs_percentage),
        preferred_sectors: Array.isArray(preferred_sectors)
          ? preferred_sectors
          : (preferred_sectors?.split(",").map(s => s.trim()) || []),
        excluded_sectors: Array.isArray(excluded_sectors)
          ? excluded_sectors
          : (excluded_sectors?.split(",").map(s => s.trim()) || []),
      },
    });

    return res.status(200).json({
      message: "User details and preferences updated successfully",
      user: { ...updatedUser, investmentPrefs: upsertPrefs },
    });
  } catch (error) {
    console.error("Update user details error:", error);
    next(error);
  }
});

const getInvestmentPrefsByEmail = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ApiError(400, "Email is required to fetch preferences.");
    }

    const userWithPrefs = await prisma.user.findUnique({
      where: { email },
      include: {
        investmentPrefs: true,
      },
    });

    if (!userWithPrefs || !userWithPrefs.investmentPrefs) {
      // If user exists but no preferences, return null or an empty object for preferences
      return res.status(200).json(new ApiResponse(200, null, "User found, but no investment preferences set."));
    }

    return res.status(200).json(new ApiResponse(200, userWithPrefs.investmentPrefs, "Investment preferences fetched successfully."));
  } catch (error) {
    next(error);
  }
});

        

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getUser, updateUserDetails, getInvestmentPrefsByEmail };

