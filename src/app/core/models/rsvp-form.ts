export enum AttendanceResponse {
  Yes = 'yes',
  No = 'no',
}

export interface RsvpForm {
  fullName: string;
  attendance: AttendanceResponse | '';
  guestCount: number | null;
  message: string;
}
