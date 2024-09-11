/**
 * Query to retrieve patient from the DICOM server or database
 */
export interface GetPatientQuery {
  /**
   * Patient UID or MRN
   */
  patientId: string;

  /**
   * Organization UID or name
   */
  organization: string;
}
