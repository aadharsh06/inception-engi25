import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { chatAgent } from "../controllers/agent_controllers.js";

const agentRouter = Router();

agentRouter.route('/chat').post(verifyJWT,chatAgent);

export {agentRouter}