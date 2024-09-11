import {OhifViewer, OhifViewerModeType} from "@/components";

interface StudyViewerPageProps {
  params: {
    studyId: string;
  },
  searchParams: {
    dicomUrl?: string;
    seriesId?: string;
    mode?: OhifViewerModeType;
  }
}

export default async function StudyViewerPage({params, searchParams}: StudyViewerPageProps) {
  return (
    <OhifViewer
      dicomUrl={searchParams.dicomUrl}
      studyInstanceUid={params.studyId}
      seriesInstanceUid={searchParams.seriesId}
      mode={searchParams.mode}
    />
  );
}
