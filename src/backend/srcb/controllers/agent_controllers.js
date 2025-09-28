import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import axios from 'axios';

const chatAgent = asyncHandler(async (req, res) => {
  const { sessionId, userId, data } = req.body;
  const { message, initialPreferenceData } = data || {};
  console.log(initialPreferenceData);
  if (!sessionId || !userId || !message) {
    
    throw new ApiError(400, "Session ID, User ID, and message are required");
  }

  try {
   
    const flaskResponse = await axios.post(
       "http://127.0.0.1:8000/agent/chat", 
      {
        sessionId,
        userId,
        data: {
          message,initialPreferenceData
        }
     
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    res.status(flaskResponse.status).json(new ApiResponse(flaskResponse.status, flaskResponse.data.message || flaskResponse.data, "Agent chat response successfully proxied"));

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new ApiError(error.response.status, error.response.data.message || "Flask agent error");
    } else if (error.request) {
     
      throw new ApiError(500, "No response from Flask agent");
    } else {
     
      throw new ApiError(500, error.message || "Error setting up request to Flask agent");
    }
  }
});

export { chatAgent };
