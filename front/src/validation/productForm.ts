export interface FormErrors {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  date_release?: string;
  date_revision?: string;
}

const ID_MIN = 3;
const ID_MAX = 10;
const NAME_MIN = 5;
const NAME_MAX = 100;
const DESC_MIN = 10;
const DESC_MAX = 200;

function todayYYYYMMDD(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addOneYear(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function validateId(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'El ID es requerido';
  if (trimmed.length < ID_MIN) return `El ID debe tener mínimo ${ID_MIN} caracteres`;
  if (trimmed.length > ID_MAX) return `El ID debe tener máximo ${ID_MAX} caracteres`;
  return undefined;
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Este campo es requerido!';
  if (trimmed.length < NAME_MIN) return `El nombre debe tener mínimo ${NAME_MIN} caracteres`;
  if (trimmed.length > NAME_MAX) return `El nombre debe tener máximo ${NAME_MAX} caracteres`;
  return undefined;
}

export function validateDescription(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Este campo es requerido!';
  if (trimmed.length < DESC_MIN) return `La descripción debe tener mínimo ${DESC_MIN} caracteres`;
  if (trimmed.length > DESC_MAX) return `La descripción debe tener máximo ${DESC_MAX} caracteres`;
  return undefined;
}

export function validateLogo(value: string): string | undefined {
  if (!value || !value.trim()) return 'Este campo es requerido!';
  return undefined;
}

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(yyyyMmDd: string): boolean {
  if (!yyyyMmDd || !YYYY_MM_DD.test(yyyyMmDd.trim())) return false;
  const [y, m, d] = yyyyMmDd.trim().split('-').map(Number);
  if (m < 1 || m > 12) return false;
  const lastDay = new Date(y, m, 0).getDate();
  if (d < 1 || d > lastDay) return false;
  return true;
}

export function validateDateRelease(value: string): string | undefined {
  if (!value || !value.trim()) return 'Este campo es requerido!';
  const trimmed = value.trim();
  if (!YYYY_MM_DD.test(trimmed)) return undefined;
  if (!isValidCalendarDate(trimmed)) return 'Fecha inválida';
  const today = todayYYYYMMDD();
  if (trimmed < today) return 'La fecha debe ser igual o mayor a la fecha actual';
  return undefined;
}

export function validateDateRevision(
  value: string,
  dateRelease: string
): string | undefined {
  if (!value || !value.trim()) return 'Este campo es requerido!';
  if (!dateRelease || !dateRelease.trim()) return undefined;
  const expected = addOneYear(dateRelease);
  if (value !== expected) return 'Debe ser exactamente un año posterior a la fecha de liberación';
  return undefined;
}

export interface ProductFormValues {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export function validateProductForm(values: ProductFormValues): FormErrors {
  const errors: FormErrors = {};
  const idErr = validateId(values.id);
  if (idErr) errors.id = idErr;
  const nameErr = validateName(values.name);
  if (nameErr) errors.name = nameErr;
  const descErr = validateDescription(values.description);
  if (descErr) errors.description = descErr;
  const logoErr = validateLogo(values.logo);
  if (logoErr) errors.logo = logoErr;
  const releaseErr = validateDateRelease(values.date_release);
  if (releaseErr) errors.date_release = releaseErr;
  const revisionErr = validateDateRevision(values.date_revision, values.date_release);
  if (revisionErr) errors.date_revision = revisionErr;
  return errors;
}

export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function computeRevisionDateFromRelease(dateRelease: string): string {
  if (!dateRelease || !isValidCalendarDate(dateRelease.trim())) return '';
  return addOneYear(dateRelease.trim());
}
