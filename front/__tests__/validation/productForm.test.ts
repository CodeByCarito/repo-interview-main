import {
  validateId,
  validateName,
  validateDescription,
  validateLogo,
  validateDateRelease,
  validateDateRevision,
  validateProductForm,
  hasFormErrors,
  computeRevisionDateFromRelease,
} from '../../src/validation/productForm';

describe('productForm validation', () => {
  describe('validateId', () => {
    it('returns error when empty', () => {
      expect(validateId('')).toBe('El ID es requerido');
      expect(validateId('   ')).toBe('El ID es requerido');
    });
    it('returns error when length < 3', () => {
      expect(validateId('ab')).toBe('El ID debe tener mínimo 3 caracteres');
    });
    it('returns error when length > 10', () => {
      expect(validateId('abcdefghijk')).toBe('El ID debe tener máximo 10 caracteres');
    });
    it('returns undefined when valid (3-10 chars)', () => {
      expect(validateId('abc')).toBeUndefined();
      expect(validateId('abcdefghij')).toBeUndefined();
      expect(validateId('trj-crd')).toBeUndefined();
    });
  });

  describe('validateName', () => {
    it('returns error when empty', () => {
      expect(validateName('')).toBe('Este campo es requerido!');
    });
    it('returns error when length < 5 or > 100', () => {
      expect(validateName('abcd')).toBe('El nombre debe tener mínimo 5 caracteres');
      expect(validateName('a'.repeat(101))).toBe('El nombre debe tener máximo 100 caracteres');
    });
    it('returns undefined when valid', () => {
      expect(validateName('Tarjeta Crédito')).toBeUndefined();
      expect(validateName('a'.repeat(5))).toBeUndefined();
      expect(validateName('a'.repeat(100))).toBeUndefined();
    });
  });

  describe('validateDescription', () => {
    it('returns error when empty', () => {
      expect(validateDescription('')).toBe('Este campo es requerido!');
    });
    it('returns error when length < 10 or > 200', () => {
      expect(validateDescription('short')).toBe('La descripción debe tener mínimo 10 caracteres');
      expect(validateDescription('a'.repeat(201))).toBe('La descripción debe tener máximo 200 caracteres');
    });
    it('returns undefined when valid', () => {
      expect(validateDescription('a'.repeat(10))).toBeUndefined();
      expect(validateDescription('a'.repeat(200))).toBeUndefined();
    });
  });

  describe('validateLogo', () => {
    it('returns error when empty', () => {
      expect(validateLogo('')).toBe('Este campo es requerido!');
      expect(validateLogo('   ')).toBe('Este campo es requerido!');
    });
    it('returns undefined when non-empty', () => {
      expect(validateLogo('assets-1.png')).toBeUndefined();
      expect(validateLogo('https://example.com/logo.png')).toBeUndefined();
    });
  });

  describe('validateDateRelease', () => {
    it('returns error when empty', () => {
      expect(validateDateRelease('')).toBe('Este campo es requerido!');
    });
    it('returns "Fecha inválida" for invalid calendar dates', () => {
      expect(validateDateRelease('2027-12-33')).toBe('Fecha inválida');
      expect(validateDateRelease('2025-02-30')).toBe('Fecha inválida');
      expect(validateDateRelease('2025-00-15')).toBe('Fecha inválida');
      expect(validateDateRelease('2025-13-01')).toBe('Fecha inválida');
    });
    it('returns error when date is in the past', () => {
      expect(validateDateRelease('2020-01-01')).toBe(
        'La fecha debe ser igual o mayor a la fecha actual'
      );
    });
    it('returns undefined when date is today or future', () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(validateDateRelease(today)).toBeUndefined();
      expect(validateDateRelease('2030-12-31')).toBeUndefined();
    });
  });

  describe('validateDateRevision', () => {
    it('returns error when empty', () => {
      expect(validateDateRevision('', '2025-01-01')).toBe('Este campo es requerido!');
    });
    it('returns error when not exactly one year after release', () => {
      expect(validateDateRevision('2026-01-02', '2025-01-01')).toBe(
        'Debe ser exactamente un año posterior a la fecha de liberación'
      );
      expect(validateDateRevision('2026-12-31', '2025-01-01')).toBe(
        'Debe ser exactamente un año posterior a la fecha de liberación'
      );
    });
    it('returns undefined when exactly one year after release', () => {
      expect(validateDateRevision('2026-01-01', '2025-01-01')).toBeUndefined();
      expect(validateDateRevision('2024-02-28', '2023-02-28')).toBeUndefined();
    });
  });

  describe('validateProductForm', () => {
    it('returns all errors for empty form', () => {
      const result = validateProductForm({
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      });
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.logo).toBeDefined();
      expect(result.date_release).toBeDefined();
      expect(result.date_revision).toBeDefined();
    });
    it('returns no errors for valid form', () => {
      const today = new Date().toISOString().slice(0, 10);
      const dateRevision = computeRevisionDateFromRelease(today);
      const result = validateProductForm({
        id: 'abc',
        name: 'Valid Name',
        description: 'Valid description here',
        logo: 'logo.png',
        date_release: today,
        date_revision: dateRevision,
      });
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('hasFormErrors', () => {
    it('returns true when there are errors', () => {
      expect(hasFormErrors({ id: 'invalid' })).toBe(true);
    });
    it('returns false when no errors', () => {
      expect(hasFormErrors({})).toBe(false);
    });
  });

  describe('computeRevisionDateFromRelease', () => {
    it('returns empty string for empty input', () => {
      expect(computeRevisionDateFromRelease('')).toBe('');
    });
    it('returns empty string for invalid calendar dates', () => {
      expect(computeRevisionDateFromRelease('2027-12-33')).toBe('');
      expect(computeRevisionDateFromRelease('2025-02-30')).toBe('');
    });
    it('returns date one year later', () => {
      expect(computeRevisionDateFromRelease('2025-01-01')).toBe('2026-01-01');
      expect(computeRevisionDateFromRelease('2023-06-15')).toBe('2024-06-15');
    });
  });
});
