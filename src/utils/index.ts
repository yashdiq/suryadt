import { HttpException, HttpStatus } from '@nestjs/common';
import { DateTime } from 'luxon';

/**
 *
 * @param dateTime - Datetime without timezone
 * @param fromTimezone - Timezone in IANA format (e.g., "America/New_York")
 * @returns number
 */
export const convertToServerTime = (
  dateTime: string,
  fromTimezone: string,
): number => {
  // Parse the input datetime with the given timezone
  const dateInFromTimezone = DateTime.fromISO(dateTime, { zone: fromTimezone });

  // Convert the datetime to Asia/Jakarta timezone
  const jakartaDate = dateInFromTimezone.setZone('Asia/Jakarta');

  return jakartaDate.get('hour');
};

/**
 *
 * @param birthdayAt - String date with format yyyy-MM-dd
 * @param timezone - Timezone in IANA format (e.g., "America/New_York")
 * @returns string
 */
export const getSchedulerExp = (
  birthdayAt: string,
  timezone: string,
): string => {
  const serverTime = DateTime.now();

  // normalize birth date
  const birthStrings = birthdayAt.split('-');
  const birthday = `${serverTime.get('year')}-${birthStrings[1]}-${birthStrings[2]}T09:00:00`;

  // convert to server time to push the message
  const messageTime = convertToServerTime(birthday, timezone);

  if (!messageTime) {
    throw new HttpException(
      'Invalid, birth date validation error. Check your input.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return `0 ${messageTime} ${Number(birthStrings[2])} ${Number(birthStrings[1])} *`;
};
