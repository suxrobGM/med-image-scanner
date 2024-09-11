"use client";
import {useState} from "react";
import {Box, Button} from "@mui/material";
import DrawIcon from "@mui/icons-material/Draw";
import {SignaturePadDialog} from "@/components";

interface SignButtonProps {
  onSign?: (dataUrl: string) => void;
}

export function SignButton(props: SignButtonProps) {
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const handleSignClick = () => {
    setSignDialogOpen(true);
  };

  const handleClose = (dataUrl: string | null) => {
    setSignDialogOpen(false);

    if (dataUrl) {
      props.onSign?.(dataUrl);
    }
  }

  return (
    <Box>
      <SignaturePadDialog open={signDialogOpen} onClose={handleClose} />
      <Button variant="contained" color="info" endIcon={<DrawIcon />} onClick={handleSignClick}>
        Sign
      </Button>
    </Box>
  );
}
