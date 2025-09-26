import { create } from "zustand";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";

type ModalType =
  | typeof MODAL_TYPES.REJECT_APPLICATION
  | typeof MODAL_TYPES.CREATE_STAFF
  | typeof MODAL_TYPES.DELETE_STAFF
  | typeof MODAL_TYPES.EDIT_STAFF
  | typeof MODAL_TYPES.VIEW_APPLICATION
  | typeof MODAL_TYPES.VIEW_MESSAGE
  | typeof MODAL_TYPES.REPLY_MESSAGE
  | typeof MODAL_TYPES.DELETE_CONTACT_MESSAGE
  | typeof MODAL_TYPES.DELETE_CAREER_SUBMISSION
  | null;

interface ModalData {
  [key: string]: unknown;
}

interface ModalStore {
  type: ModalType;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, data: {}, isOpen: false }),
}));
