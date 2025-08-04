"use client";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import {Badge, Box, IconButton, Stack, TextField, Toolbar, styled} from "@mui/material";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {useNotificationStore, useSidebarStore} from "@/core/stores";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export function Topbar() {
  const router = useRouter();
  const t = useTranslations();
  const {isExpanded, toggleSidebar} = useSidebarStore();
  const {toggleNotification} = useNotificationStore();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputEl = event.target as HTMLInputElement;
      router.push(`/patient/${inputEl.value.trim()}`);
      event.preventDefault();
    }
  };

  return (
    <AppBar position="fixed" open={isExpanded}>
      <Toolbar
        disableGutters
        sx={{
          flex: 1,
          px: 1,
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="open drawer"
            onClick={() => toggleSidebar()}
          >
            {isExpanded ? <MenuOpenOutlinedIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{minWidth: 20}} />
          <Box>
            <TextField
              placeholder={t("components.topBar.search")}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              onKeyDown={handleSearch}
            />
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-around">
          {/* <Stack direction="row" spacing={2}>
              <Button sx={{color: (theme) => theme.palette.grey["700"]}} startIcon={<PlayCircleOutlineIcon />}>
                {t("components.topBar.takeATour")}
              </Button>
              <Button sx={{color: (theme) => theme.palette.grey["700"]}} startIcon={<UpgradeIcon />}>
                {t("components.topBar.upgrade")}
              </Button>
              <Divider orientation="vertical" flexItem />
            </Stack> */}
          {/* <IconButton onClick={() => toggleNotification()}>
            <Badge
              color="error"
              variant="dot"
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
