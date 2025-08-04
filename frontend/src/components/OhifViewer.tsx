"use client";

import {Box, Typography} from "@mui/material";
import {useOrganizationStore} from "@/core/stores";

export type OhifViewerModeType =
  | "viewer"
  | "segmentation"
  | "microscopy"
  | "dynamic-volume"
  | "tmtv";

interface OhifViewerProps {
  width?: string;
  height?: string;
  dicomUrl?: string;
  studyInstanceUid?: string;
  seriesInstanceUid?: string;
  mode?: OhifViewerModeType;
}

interface OhifViewerMode {
  mode: OhifViewerModeType;
  label: string;
}

const viewerUrl = process.env.NEXT_PUBLIC_VIEWER_URL;

/**
 * Get available OHIF viewer modes based on the provided modalities
 * @param modalitiesStr Modalities string separated by a specific separator
 * @param separator Separator used to split the modalities string, default is " "
 * @returns Available OHIF viewer modes
 */
export function getOhifViewerModes(modalitiesStr: string, separator = " "): OhifViewerMode[] {
  const modalities = modalitiesStr.split(separator).map((modality) => modality.trim());
  const availableModes: OhifViewerMode[] = [];
  const basicViewerExcluded = ["SM", "ECG", "SR", "SEG", "RTSTRUC"];
  const segmentationExcluded = ["SM", "US", "MG", "OT", "DOC", "CR"];

  if (!modalities.every((modality) => basicViewerExcluded.includes(modality))) {
    availableModes.push({mode: "viewer", label: "Basic Viewer"});
  }

  if (!modalities.every((modality) => segmentationExcluded.includes(modality))) {
    availableModes.push({mode: "segmentation", label: "Segmentation"});
  }

  if (modalities.includes("PT") && modalities.includes("CT")) {
    availableModes.push({mode: "tmtv", label: "Total Metabolic Tumor Volume"});
  }

  if (modalities.includes("PT") && modalities.includes("CT")) {
    availableModes.push({mode: "dynamic-volume", label: "4D PT/CT"});
  }

  if (modalities.includes("SM") && modalities.length === 1) {
    availableModes.push({mode: "microscopy", label: "Microscopy"});
  }

  return availableModes;
}

export function OhifViewer(props: OhifViewerProps) {
  const {organization} = useOrganizationStore();
  const width = props.width ?? "100%";
  const height = props.height ?? "94vh";
  const mode = props.mode ?? "viewer";
  const dicomUrl = props.dicomUrl ?? organization.dicomUrl;

  if (!dicomUrl) {
    return <Typography color="error">Error: No DICOM URL provided</Typography>;
  }

  const query = new URLSearchParams({dicomUrl: dicomUrl});

  if (props.studyInstanceUid) {
    query.set("StudyInstanceUIDs", props.studyInstanceUid);
  }
  if (props.seriesInstanceUid) {
    query.set("SeriesInstanceUIDs", props.seriesInstanceUid);
  }

  return (
    <Box
      sx={{
        width,
        height,
        overflowY: "hidden",
      }}
    >
      <iframe
        src={`${viewerUrl}/${mode}?${query.toString()}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </Box>
  );
}
