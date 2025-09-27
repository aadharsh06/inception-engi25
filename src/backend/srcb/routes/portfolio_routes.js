import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPortfolio,
  getPortfolio,
  getPortfolioHistory,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio_controllers.js";

const portfolioRouter = Router();

portfolioRouter.route("/").post(verifyJWT, createPortfolio);
portfolioRouter.route("/:userId").get(verifyJWT, getPortfolio);
portfolioRouter.route("/:userId/history").get(verifyJWT, getPortfolioHistory);
portfolioRouter.route("/:userId").put(verifyJWT, updatePortfolio);
portfolioRouter.route("/:userId").delete(verifyJWT, deletePortfolio);

export { portfolioRouter };