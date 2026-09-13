export interface User {
  id: string;
  /** Display name derived from firstName + lastName for UI. */
  name: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}
