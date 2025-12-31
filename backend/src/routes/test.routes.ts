import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Backend Eventik opérationnel 🚀" });
});

export default router;
