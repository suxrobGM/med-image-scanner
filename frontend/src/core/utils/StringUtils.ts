/**
 * Static class that contains utility methods for string manipulation.
 */
export class StringUtils {
  private constructor() {}

  /**
   * Capitalize the first letter of the string.
   * @param value String to capitalize
   * @returns Capitalized string
   */
  static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /**
   * Check if the string is null or empty.
   * @param value String to check
   * @returns True if the string is null or empty, false otherwise
   */
  static isNullOrEmpty(value: string | null | undefined): boolean {
    return value == null || value === "";
  }

  static toPercent(floatNumber: number): string {
    return (floatNumber * 100).toFixed(2) + "%";
  }
}
