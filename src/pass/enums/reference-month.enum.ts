export enum ReferenceMonth {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}

export const REFERENCE_MONTH_ORDER: ReferenceMonth[] = [
  ReferenceMonth.JANUARY,
  ReferenceMonth.FEBRUARY,
  ReferenceMonth.MARCH,
  ReferenceMonth.APRIL,
  ReferenceMonth.MAY,
  ReferenceMonth.JUNE,
  ReferenceMonth.JULY,
  ReferenceMonth.AUGUST,
  ReferenceMonth.SEPTEMBER,
  ReferenceMonth.OCTOBER,
  ReferenceMonth.NOVEMBER,
  ReferenceMonth.DECEMBER,
];

export function monthIndexToReferenceMonth(monthIndex: number): ReferenceMonth {
  return REFERENCE_MONTH_ORDER[monthIndex];
}

export function referenceMonthToIndex(month: ReferenceMonth): number {
  return REFERENCE_MONTH_ORDER.indexOf(month);
}
