import { Router, Request, Response } from 'express';
import { createEvent, getAllEvents } from '../services/event.service';
import { Event } from '../types/models';

const router = Router();

// GET all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newEvent: Event = req.body;
    // Basic validation
    if (!newEvent || !newEvent.title || !newEvent.user_id) {
      return res.status(400).json({ message: 'Invalid event data' });
    }
    
    const eventId = await createEvent(newEvent);
    res.status(201).json({ id: eventId, message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

export default router;