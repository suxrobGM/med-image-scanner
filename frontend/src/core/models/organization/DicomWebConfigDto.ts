export interface DicomWebConfigDto {
  name: string;
  wadoUriRoot: string;
  qidoRoot: string;
  wadoRoot: string;
  qidoSupportsIncludeField: boolean;
  supportsReject: boolean;
  imageRendering: string;
  thumbnailRendering: string;
  enableStudyLazyLoad: boolean;
  supportsFuzzyMatching: boolean;
  supportsWildcard: boolean;
}
