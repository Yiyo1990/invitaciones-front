export enum EventType {
  Wedding = 'wedding',
  Quinceanera = 'quinceanera',
  Birthday = 'birthday',
  BabyShower = 'baby_shower',
  Baptism = 'baptism',
  Graduation = 'graduation',
  Corporate = 'corporate',
}

export interface EventTypeOption {
  value: EventType;
  label: string;
  description: string;
  icon: string;
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: EventType.Wedding,
    label: 'Boda',
    description: 'Celebración de matrimonio',
    icon: '💍',
  },
  {
    value: EventType.Quinceanera,
    label: 'XV años',
    description: 'Fiesta de quinceañera',
    icon: '👑',
  },
  {
    value: EventType.Birthday,
    label: 'Cumpleaños',
    description: 'Fiesta de cumpleaños',
    icon: '🎂',
  },
  {
    value: EventType.BabyShower,
    label: 'Baby Shower',
    description: 'Celebración prenatal',
    icon: '🍼',
  },
  {
    value: EventType.Baptism,
    label: 'Bautizo',
    description: 'Ceremonia de bautizo',
    icon: '🕊️',
  },
  {
    value: EventType.Graduation,
    label: 'Graduación',
    description: 'Ceremonia de graduación',
    icon: '🎓',
  },
  {
    value: EventType.Corporate,
    label: 'Evento empresarial',
    description: 'Eventos corporativos y networking',
    icon: '🏢',
  },
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = EVENT_TYPE_OPTIONS.reduce(
  (labels, option) => {
    labels[option.value] = option.label;
    return labels;
  },
  {} as Record<EventType, string>,
);
