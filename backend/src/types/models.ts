export interface Event {
  id?: number;
  user_id: number;
  title: string;
  description: string;
  location: string;
  event_date: Date | string;
  capacity: number;
  slug: string;
}

export interface Invitee {
  email: string;
}

export interface Ticket {
  id?: number;
  event_id: number;
  owner_email: string;
  qr_code: string;
}
