/**
 * Utility functions for date operations
 */
export class DateUtils {
  private constructor() {}

  /**
   * Get the person's age based on the date of birth
   * @param birthDate Date of birth in string format or Date object
   * @returns Person's age
   */
  static getAge(birthDate: Date | string): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Get the user timezone offset in the format of UTC±HH
   * @returns
   */
  static getTimezoneString(): string {
    const offset = new Date().getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, "0");
    // const minutes = (Math.abs(offset) % 60).toString().padStart(2, "0");

    return `UTC${sign}${hours}`;
  }

  /**
   * Format a date object or string to a locale date string
   * @param date Date object or string
   * @param locales Locale string or array of locale strings
   * @returns Formatted date string
   */
  static formatDate(date: Date | string, locales?: Intl.LocalesArgument): string {
    return new Date(date).toLocaleDateString(locales);
  }

  static formatDateTime(date: Date | string, locales?: Intl.LocalesArgument): string {
    return new Date(date).toLocaleString(locales);
  }
}
