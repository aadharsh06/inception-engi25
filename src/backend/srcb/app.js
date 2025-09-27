import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user_routes.js";
import { portfolioRouter } from "./routes/portfolio_routes.js";
import { agentRouter } from "./routes/agent_routes.js";

const app=express()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/user",userRouter);
app.use("/api/portfolio",portfolioRouter);
app.use("/api/agent",agentRouter);


app.get("/",(req,res)=> {
  res.send("Aadarsh is the goat!!!");
})

export {app};