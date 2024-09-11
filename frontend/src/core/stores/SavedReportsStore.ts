import {create} from "zustand";

interface SavedReportsStore {
  savedReports: Set<string>;
  saveReport: (reportId: string) => void;
  unsaveReport: (reportId: string) => void;
}

export const useSavedReportsStore = create<SavedReportsStore>((set) => ({
  savedReports: new Set(),
  saveReport: (reportId) => set((state) => {
    state.savedReports.add(reportId);
    return state;
  }),
  unsaveReport: (reportId) => set((state) => {
    state.savedReports.delete(reportId);
    return state;
  }),
}));
