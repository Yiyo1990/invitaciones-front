import { AuthUserResponse, UserApiResponse } from '../models/auth-api';
import { User } from '../models/user';

export function mapAuthUserToUser(apiUser: AuthUserResponse | UserApiResponse): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    role: apiUser.role,
    isActive: apiUser.isActive,
    name: formatUserDisplayName(apiUser.firstName, apiUser.lastName),
  };
}

export function formatUserDisplayName(firstName: string, lastName: string | null): string {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName || 'Usuario';
}
