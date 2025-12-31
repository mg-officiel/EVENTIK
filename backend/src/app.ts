import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event.routes";
import ticketRoutes from "./routes/ticket.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend EVENTIK OK");
});
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);


export default app;
