import { EventType } from './event-type';

export interface InvitationTemplate {
  id: string;
  name: string;
  category: EventType;
  description?: string;
  previewImage: string;
  isPremium: boolean;
  isActive: boolean;
}
