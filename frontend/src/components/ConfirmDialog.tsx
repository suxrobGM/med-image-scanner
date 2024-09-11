import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import CircularProgressIcon from "@mui/material/CircularProgress";

export interface ConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dialogProps?: DialogProps;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const title = props.title ?? "Are you sure?";
  const message = props.message ?? "Do you really want to proceed?";
  const isLoading = props.isLoading ?? false;

  return (
    <Dialog open={props.open} {...props.dialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={props.onCancel}>Cancel</Button>
        <Button 
          color="primary"
          variant="contained"
          onClick={props.onConfirm}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgressIcon size={20} /> : null}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
