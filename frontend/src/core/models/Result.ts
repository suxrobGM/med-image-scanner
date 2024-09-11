export interface Result<T = undefined> {
  data?: T | null;
  error?: string | null;
  success: boolean;
}
