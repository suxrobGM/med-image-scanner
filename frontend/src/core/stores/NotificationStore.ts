import {create} from "zustand";

interface NotificationStore {
  open: boolean;
  toggleNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  open: false,
  toggleNotification: () => set((state) => ({open: !state.open})),
}));
