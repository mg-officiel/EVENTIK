import { Router, Request, Response } from 'express';
import { createRestrictedTickets } from '../services/ticket.service';
import { Invitee } from '../types/models';

const router = Router();

interface CreateTicketsRequestBody {
  eventId: number;
  invitees: Invitee[];
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, invitees }: CreateTicketsRequestBody = req.body;

    // Basic validation
    if (!eventId || !invitees || !Array.isArray(invitees) || invitees.length === 0) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    await createRestrictedTickets(eventId, invitees);
    res.status(201).json({ message: 'Tickets created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating tickets', error });
  }
});

export default router;
