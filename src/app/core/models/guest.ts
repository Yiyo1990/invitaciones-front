import { GuestStatus } from './guest-status';

export interface Guest {
  id: string;
  eventId: string;
  fullName: string;
  phone?: string;
  status: GuestStatus;
  companions: number;
  confirmedAt?: Date;
  message?: string;
}

export interface GuestListMetrics {
  totalGuests: number;
  confirmed: number;
  declined: number;
  pending: number;
  confirmedPeople: number;
}

export interface EventGuestsPage {
  eventId: string;
  eventName: string;
  guests: Guest[];
}

export type GuestStatusFilter = GuestStatus | 'ALL';

export interface GuestFilterOptions {
  query?: string;
  status?: GuestStatusFilter;
}
