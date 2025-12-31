import { db } from "../config/bd";
import { randomBytes } from "crypto";
import { Invitee } from "../types/models";

const generateQRCodeValue = (): string => {
  return randomBytes(16).toString("hex");
};

export const createRestrictedTickets = async (
  eventId: number,
  invitees: Invitee[]
): Promise<void> => {
  try {
    for (const invitee of invitees) {
      const qrCode = generateQRCodeValue();

      await db.execute(
        `INSERT INTO tickets (event_id, owner_email, qr_code)
         VALUES (?, ?, ?)`,
        [eventId, invitee.email, qrCode]
      );

      await db.execute(
        `UPDATE event_invitees 
         SET has_ticket = true 
         WHERE event_id = ? AND email = ?`,
        [eventId, invitee.email]
      );
    }
  } catch (error) {
    console.error("Error creating restricted tickets:", error);
    throw error;
  }
};
