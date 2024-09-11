/**
 * Query to retrieve studies from the DICOM server
 */
export interface GetStudiesQuery {
  /**
   * Patient UID or MRN
   */
  patientId: string;

  /**
   * Organization UID or name
   */
  organization: string;
}
