import { isAfter, isBefore, parseISO } from 'date-fns';

export const validateUpdate = (data) => {
  const errors = {};

  if (!data.content?.trim()) {
    errors.content = 'Content is required';
  }

  if (!data.weekStart) {
    errors.weekStart = 'Start date is required';
  }

  if (!data.weekEnd) {
    errors.weekEnd = 'End date is required';
  }

  if (data.weekStart && data.weekEnd) {
    const start = parseISO(data.weekStart);
    const end = parseISO(data.weekEnd);

    if (isAfter(start, end)) {
      errors.weekEnd = 'End date must be after start date';
    }

    // Optional: Enforce week length
    // if (differenceInDays(end, start) !== 6) {
    //   errors.weekEnd = 'Update must cover exactly one week';
    // }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 