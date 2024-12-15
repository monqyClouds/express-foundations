import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Africa/Lagos');

export const timer = dayjs;

export function customError(data: {name: string; message: string}): never {
  const newError = new Error(data.message);
  newError.name = data.name;
  throw newError;
}

export function objectCleaner(data: unknown) {
  if (typeof data === 'object' && data) {
    for (const key in data) {
      const dataKey = key as keyof typeof data;
      if (data[dataKey] === '""' || data[dataKey] === '') {
        delete data[dataKey];
      }
    }
  }
}
