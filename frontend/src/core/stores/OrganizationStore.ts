import {create} from "zustand";
import {OrganizationDto} from "../models";

interface OrganizationStore {
  organization: OrganizationDto;
  setOrganization: (organization: OrganizationDto) => void;
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organization: {} as OrganizationDto,
  setOrganization: (organization) => set({organization}),
}));
