export enum GuestStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
}

export const GUEST_STATUS_LABELS: Record<GuestStatus, string> = {
  [GuestStatus.Pending]: 'Pendiente',
  [GuestStatus.Confirmed]: 'Confirmado',
  [GuestStatus.Declined]: 'No asistirá',
};
