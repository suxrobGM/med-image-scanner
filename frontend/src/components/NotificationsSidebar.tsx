"use client";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  ListItem,
  List,
  useTheme,
  Tab,
} from "@mui/material";
import {ChevronRight, Close, NotificationsNoneOutlined} from "@mui/icons-material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {blue} from "@mui/material/colors";
import {useNotificationStore} from "@/core/stores";
import AiMagicIcon from "./icons/AiMagicIcon";

interface MessageCountChipProps {
  label: string | number;
}

function MessageCountChip({label}: MessageCountChipProps) {
  return (
    <Box
      sx={{
        bgcolor: blue["50"],
        color: blue["900"],
        px: 1.5,
        py: 0,
        borderRadius: 3,
        borderColor: blue.A100,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <Typography variant="caption" sx={{p: 0, m: 0}} fontWeight={600}>
        {label}
      </Typography>
    </Box>
  );
}

function NewFeatureComponent() {
  const t = useTranslations();
  return (
    <Box>
      <Stack direction="row" spacing={-1} alignItems="center" mb={1}>
        <AiMagicIcon fontSize="large" color="primary" />
        <Typography variant="body1" fontWeight={600}>
          {t("components.notificationsSideBar.newFeatureAlert")}
        </Typography>
      </Stack>
      <Typography variant="body2">{t("components.notificationsSideBar.newEnhancementsIntroducing")}</Typography>
      <Button variant="text" color="primary" endIcon={<ChevronRight />}>
        {t("components.notificationsSideBar.learnMore")}
      </Button>
      <Box />
      <Typography variant="caption" color="grey.600">
        {t("components.notificationsSideBar.minsAgo")}
      </Typography>
    </Box>
  );
}

export default function NotificationsSidebar() {
  const t = useTranslations();
  const TABS = {
    ALL: t("components.notificationsSideBar.all"),
    MENTIONS: t("components.notificationsSideBar.mentions"),
    UNREAD: t("components.notificationsSideBar.unread"),
  };
  const {open, toggleNotification} = useNotificationStore();
  const [tabValue, setTabValue] = useState<string>(TABS.ALL);
  const handleOnClose = () => toggleNotification();
  const theme = useTheme();
  const handleTabChange = (_: any, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleOnClose} sx={{zIndex: theme.zIndex.drawer + 10}}>
      <Box width={360}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} p={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsNoneOutlined color="primary" />
            <Typography variant="h6">{t("components.notificationsSideBar.notifications")}</Typography>
          </Stack>
          <IconButton onClick={handleOnClose}>
            <Close />
          </IconButton>
        </Stack>
        <TabContext value={tabValue}>
          <TabList onChange={handleTabChange}>
            <Tab value={TABS.ALL} label={TABS.ALL} />
            <Tab
              value={TABS.MENTIONS}
              label={
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">{TABS.MENTIONS}</Typography>
                  <MessageCountChip label={2} />
                </Stack>
              }
            />
            <Tab
              value={TABS.UNREAD}
              label={
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">{TABS.UNREAD}</Typography>
                  <MessageCountChip label={21} />
                </Stack>
              }
            />
          </TabList>
          <Divider />
          <TabPanel value={TABS.ALL} sx={{p: 0}}>
            <List sx={{width: "100%"}}>
              <ListItem divider sx={{bgcolor: blue["50"]}}>
                <NewFeatureComponent />
              </ListItem>
            </List>
          </TabPanel>
        </TabContext>
      </Box>
    </Drawer>
  );
}
