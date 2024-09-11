/**
 * Query to retrieve study series from the DICOM server
 */
export interface GetStudySeriesQuery {
  /**
   * Study UID
   */
  studyId: string;

  /**
   * Organization UID or name
   */
  organization: string;
}
