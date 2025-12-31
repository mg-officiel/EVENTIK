import { Request, Response } from "express";
import { createEvent } from "../services/event.service";
import { slugify } from "../utils/slugify";

export const createEventHandler = async (req: Request, res: Response) => {
  try {
    const slug = slugify(req.body.title);

    const eventId = await createEvent({
      ...req.body,
      slug
    });

    res.status(201).json({
      message: "Événement créé",
      eventId,
      url: `/e/${slug}`
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur création événement" });
  }
};
