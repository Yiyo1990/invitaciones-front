export enum EventStatus {
  Draft = 'draft',
  Published = 'published',
  Finished = 'finished',
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.Draft]: 'Borrador',
  [EventStatus.Published]: 'Publicado',
  [EventStatus.Finished]: 'Finalizado',
};
