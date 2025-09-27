import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse";
import { asyncHandler } from "../utils/asynchandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPortfolio = asyncHandler(async (req, res, next) => {
  const { portfolioJSON, riskProfile } = req.body;
  const userId = req.user.id;

  if (!portfolioJSON || !riskProfile) {
    throw new ApiError(400, "Portfolio JSON and risk profile are required");
  }

  const portfolio = await prisma.portfolio.create({
    data: {
      userId,
      portfolioJSON,
      riskProfile,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, portfolio, "Portfolio created successfully"));
});

const getPortfolio = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      userId: parseInt(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!portfolio) {
    throw new ApiError(404, "Portfolio not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Portfolio fetched successfully"));
});

const getPortfolioHistory = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const portfolioHistory = await prisma.portfolio.findMany({
    where: {
      userId: parseInt(userId),
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!portfolioHistory || portfolioHistory.length === 0) {
    throw new ApiError(404, "No portfolio history found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, portfolioHistory, "Portfolio history fetched successfully"));
});

const updatePortfolio = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { updatedPortfolioJSON, riskProfile } = req.body;

  if (!updatedPortfolioJSON || !riskProfile) {
    throw new ApiError(400, "Updated portfolio JSON and risk profile are required");
  }

  const existingPortfolio = await prisma.portfolio.findFirst({
    where: {
      userId: parseInt(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!existingPortfolio) {
    throw new ApiError(404, "Portfolio not found for this user");
  }

  const updatedPortfolio = await prisma.portfolio.update({
    where: {
      id: existingPortfolio.id,
    },
    data: {
      portfolioJSON: updatedPortfolioJSON,
      riskProfile: riskProfile,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPortfolio, "Portfolio updated successfully"));
});

const deletePortfolio = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const deletedPortfolio = await prisma.portfolio.deleteMany({
    where: {
      userId: parseInt(userId),
    },
  });

  if (deletedPortfolio.count === 0) {
    throw new ApiError(404, "No portfolios found for this user to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Portfolios deleted successfully"));
});

export {
  createPortfolio,
  getPortfolio,
  getPortfolioHistory,
  updatePortfolio,
  deletePortfolio,
};
