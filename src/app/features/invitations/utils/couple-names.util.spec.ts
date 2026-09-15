import { parseCoupleNames, getNameInitial } from './couple-names.util';

describe('couple-names.util', () => {
  it('gets initials from names', () => {
    expect(getNameInitial('rafaela')).toBe('R');
    expect(getNameInitial('  josué')).toBe('J');
    expect(getNameInitial('')).toBe('');
  });

  it('parses names separated by &', () => {
    expect(parseCoupleNames('Ana & Carlos')).toEqual({ first: 'Ana', second: 'Carlos' });
  });

  it('parses names separated by y', () => {
    expect(parseCoupleNames('Sofía y Diego')).toEqual({ first: 'Sofía', second: 'Diego' });
  });

  it('keeps a single name', () => {
    expect(parseCoupleNames('Evento familiar')).toEqual({
      first: 'Evento familiar',
      second: null,
    });
  });
});
