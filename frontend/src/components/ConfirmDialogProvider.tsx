"use client";

import {ReactNode, createContext, useContext, useState} from "react";
import {ConfirmDialog, ConfirmDialogProps} from "./ConfirmDialog";

type ConfirmProps = Omit<ConfirmDialogProps, "open">;

interface ConfirmDialogContextType {
  confirm: (props: ConfirmProps) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  confirm: () => {},
});

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
};

export function ConfirmDialogProvider({children}: {children: ReactNode}) {
  const [dialogState, setDialogState] = useState<ConfirmDialogProps>({open: false});

  const confirm = (props: ConfirmProps) => {
    setDialogState({...props, open: true}); // open dialog
  };

  const handleConfirm = () => {
    dialogState.onConfirm?.();
    setDialogState((prev) => ({...prev, open: false}));
  };

  const handleCancel = () => {
    dialogState.onCancel?.();
    setDialogState((prev) => ({...prev, open: false}));
  };

  return (
    <ConfirmDialogContext.Provider value={{confirm}}>
      {children}
      <ConfirmDialog {...dialogState} onConfirm={handleConfirm} onCancel={handleCancel} />
    </ConfirmDialogContext.Provider>
  );
}
