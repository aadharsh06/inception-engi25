import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyJWT=asyncHandler( async (req,res,next) => {
try {
  const token=req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];


 if(!token) {
  throw new ApiError(401,"JWT token not received.")
 }
 const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 const user = await prisma.user.findUnique({
  where: {
    id: decodedToken?.id,
  },
 });
 if (!user) throw new ApiError(401, "JWT verification failed.");
 req.user = user;
 next();
}
catch (error) {
throw new ApiError(401,"Failed to verify JWT");
}

})