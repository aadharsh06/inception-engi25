import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse";
import { asyncHandler } from "../utils/asynchandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

const generateRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  return token;
};

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password} = req.body;
    const requiredFields = ['username', 'email', 'password']
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (foundUser) {
      throw new ApiError(400, "A user with the given email address already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        age,
        location,
        occupation,
        investment_experience,
      },
    });

    const token = generateAccessToken(user.id);

    return res.status(201).json(
      new ApiResponse(200, { user, token }, "User registered successfully")
    );
  } catch (error) {
    throw new ApiError(400, error.message || "Error occurred while registering the user.");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User with email does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", token, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user, token, refreshToken }, "User logged in successfully"));
  } catch (error) {
    throw new ApiError(400, error.message || "Error occurred while logging in the user.");
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    await prisma.session.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        refreshToken: null,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(400, error.message || "Error occurred while logging out the user.");
  }
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken?.id,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if(incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used!")
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = req.user; 

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user; 

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { username, email, age, location, occupation, investment_experience } = req.body;

  const user = req.user; 

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: username || user.username,
      email: email || user.email,
      age: age || user.age,
      location: location || user.location,
      occupation: occupation || user.occupation,
      investment_experience: investment_experience || user.investment_experience,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User details updated successfully"));
});


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getUser, updateUserDetails };
