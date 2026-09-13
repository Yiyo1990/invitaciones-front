import { EventType } from '../../../core/models/event-type';
import { InvitationTemplate } from '../../../core/models/invitation-template';

/** Single mock source for invitation templates (catalog + create/edit flows). */
export const INVITATION_TEMPLATES_MOCK: InvitationTemplate[] = [
  {
    id: 'wedding-classic',
    name: 'Boda Clásica',
    category: EventType.Wedding,
    description: 'Elegancia atemporal con tipografía serif y acentos dorados.',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'wedding-modern',
    name: 'Boda Moderna',
    category: EventType.Wedding,
    description: 'Diseño minimalista con tipografía limpia y mucho espacio en blanco.',
    previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    isPremium: true,
    isActive: true,
  },
  {
    id: 'wedding-floral',
    name: 'Boda Floral',
    category: EventType.Wedding,
    description: 'Motivos botánicos suaves ideales para celebraciones al aire libre.',
    previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'quince-elegant',
    name: 'XV Elegante',
    category: EventType.Quinceanera,
    description: 'Look sofisticado con detalles dorados para una quinceañera inolvidable.',
    previewImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    isPremium: true,
    isActive: true,
  },
  {
    id: 'quince-rose',
    name: 'XV Rosa',
    category: EventType.Quinceanera,
    description: 'Paleta rosa y tipografía delicada para un ambiente romántico.',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'birthday-kids',
    name: 'Cumpleaños Infantil',
    category: EventType.Birthday,
    description: 'Colores vibrantes y estilo divertido para fiestas de niños.',
    previewImage: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'baby-shower-soft',
    name: 'Baby Shower',
    category: EventType.BabyShower,
    description: 'Tonos pastel y detalles suaves para celebrar la llegada del bebé.',
    previewImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e6?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'baptism-classic',
    name: 'Bautizo Clásico',
    category: EventType.Baptism,
    description: 'Diseño sereno con tipografía elegante para ceremonias religiosas.',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    isPremium: false,
    isActive: true,
  },
  {
    id: 'graduation-modern',
    name: 'Graduación Moderna',
    category: EventType.Graduation,
    description: 'Estilo contemporáneo para celebrar logros académicos.',
    previewImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    isPremium: true,
    isActive: true,
  },
  {
    id: 'corporate-minimal',
    name: 'Corporativo Minimal',
    category: EventType.Corporate,
    description: 'Diseño sobrio y profesional para eventos empresariales.',
    previewImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    isPremium: true,
    isActive: true,
  },
];

/** @deprecated Prefer INVITATION_TEMPLATES_MOCK — kept as alias for gradual migration. */
export const MOCK_TEMPLATES = INVITATION_TEMPLATES_MOCK;
