import { db } from "../config/bd";
import { Event } from "../types/models";
import { OkPacket, RowDataPacket } from "mysql2";

export const createEvent = async (event: Event): Promise<number> => {
  const {
    user_id,
    title,
    description,
    location,
    event_date,
    capacity,
    slug
  } = event;

  try {
    const [result] = await db.execute<OkPacket>(
      `INSERT INTO events 
       (user_id, title, description, location, event_date, capacity, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, location, event_date, capacity, slug]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM events`);
    return rows as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
