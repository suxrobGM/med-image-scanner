import {Typography} from "@mui/material";
import {Banner} from "./Banner";

interface MessageBannerProps {
  message: string;
}

/**
 * Banner with a message.
 */
export function MessageBanner({message}: MessageBannerProps) {
  return (
    <Banner>
      <Typography variant="h4" sx={{color: "white", fontSize: 45, fontWeight: 600, mb: 1}}>
        {message}
      </Typography>
    </Banner>
  );
}
