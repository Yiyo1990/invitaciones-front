export enum EventStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.Draft]: 'Borrador',
  [EventStatus.Published]: 'Publicado',
  [EventStatus.Completed]: 'Finalizado',
  [EventStatus.Cancelled]: 'Cancelado',
};
