"use client";

import {Chip, styled} from "@mui/material";

interface StyledChipProps {
  label: string;
}

const ImageStyledChip = styled((props: StyledChipProps) => (
  <Chip variant="outlined" size="small" color="primary" {...props} />
))(({theme}) => ({
  borderRadius: 3,
  padding: theme.spacing(0.5, 1),
}));

export default ImageStyledChip;
