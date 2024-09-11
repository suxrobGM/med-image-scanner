"use client";
import {useRef, useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  styled,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadDialogProps {
  open: boolean;
  onClose?: (dataUrl: string | null) => void;
}

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
}));

export function SignaturePadDialog(props: SignaturePadDialogProps) {
  const signatureCanvasRef = useRef<SignatureCanvas>(null);
  const [isPadEmpty, setPadEmpty] = useState(true);

  const clearPad = () => {
    signatureCanvasRef.current?.clear();
    setPadEmpty(true);
  };

  const handleSave = () => {
    const dataUrl = signatureCanvasRef.current?.toDataURL();
    clearPad();
    props.onClose?.(dataUrl ?? null);
  };

  const handleCancel = () => {
    clearPad();
    props.onClose?.(null);
  }

  const handleBegin = () => {
    setPadEmpty(false);
  };

  return (
    <BootstrapDialog open={props.open}>
      <DialogContent>
        <SignatureCanvas
          ref={signatureCanvasRef}
          penColor="black"
          backgroundColor="white"
          canvasProps={{width: 500, height: 300}}
          onBegin={handleBegin}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" gap={2}>
          <Button variant="contained" onClick={handleSave} disabled={isPadEmpty}>
            Save
          </Button>
          <Button variant="contained" onClick={clearPad}>
            Clear
          </Button>
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  );
}
