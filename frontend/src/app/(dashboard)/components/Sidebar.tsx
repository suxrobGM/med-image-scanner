"use client";

//@ts-ignore
import React, {useState} from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import {
  Avatar,
  Box,
  CSSObject,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Theme,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {useSession} from "next-auth/react";
import {useTranslations} from "next-intl";
import {SignOutButton} from "@/components";
import {UserRoleType} from "@/core/models";
import {useSidebarStore} from "@/core/stores";
import {UserUtils} from "@/core/utils";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== "open"})(
  ({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

interface NavItem {
  title: string;
  icon?: JSX.Element;
  href?: string;
  children?: NavItem[];
}

interface NavListProps {
  items: NavItem[];
  flexGrow?: number;
}

export function Sidebar() {
  const t = useTranslations();
  const session = useSession();
  const {isExpanded} = useSidebarStore();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const userRole = session.data?.user?.role;

  const topNavItems: NavItem[] = [
    {
      title: t("components.sideBar.dashboard"),
      icon: <DashboardIcon />,
      href: "/",
    },
  ];

  if (UserUtils.isAppAdmin(userRole)) {
    topNavItems.push({
      title: "Admin",
      icon: <AdminPanelSettingsIcon />,
      children: [
        {
          title: "Users",
          icon: <SupervisorAccountIcon />,
          href: "/admin/users",
        },
        {
          title: "Organizations",
          icon: <ApartmentIcon />,
          href: "/admin/organizations",
        },
      ],
    });
  }

  if (userRole === UserRoleType.SUPER_ADMIN || userRole === UserRoleType.ORG_ADMIN) {
    topNavItems.push({
      title: "Organization",
      icon: <CorporateFareIcon />,
      children: [
        {
          title: "Edit Organization",
          icon: <ApartmentIcon />,
          href: "/organization/edit",
        },
        {
          title: "Manage Members",
          icon: <SupervisorAccountIcon />,
          href: "/organization/users",
        },
      ],
    });
  }

  const bottomNavItems: NavItem[] = [
    {
      title: "User Profile",
      icon: <AccountBoxIcon />,
      href: "/profile",
    },
  ];

  const NavList = (props: NavListProps) => {
    const [open, setOpen] = useState<{[key: string]: boolean}>({});

    const handleClick = (title: string) => {
      setOpen((prevState) => ({
        ...prevState,
        [title]: !prevState[title],
      }));
    };

    const renderNavItems = (items: NavItem[]) => {
      return items.map((item) => (
        <React.Fragment key={item.title}>
          <ListItem disablePadding>
            <ListItemButton
              {...(item.href ? {href: item.href} : {})}
              onClick={() => item.children && handleClick(item.title)}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? "initial" : "center",
                px: 2.5,
              }}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isExpanded ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}

              <ListItemText primary={item.title} sx={{opacity: isExpanded ? 1 : 0}} />
              {item.children &&
                isExpanded &&
                (open[item.title] ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          {item.children && (
            <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavItems(item.children)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ));
    };

    return <List sx={{flexGrow: props.flexGrow}}>{renderNavItems(props.items)}</List>;
  };

  return (
    <Drawer variant="permanent" open={isExpanded}>
      <DrawerHeader />
      <Stack direction="column" height="100%">
        <NavList items={topNavItems} flexGrow={1} />
        <Divider />
        <NavList items={bottomNavItems} flexGrow={0} />

        <Stack direction="row" alignItems="center" spacing={2} p={2}>
          <Tooltip title="Account Settings">
            <Avatar variant="rounded" onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
              {UserUtils.getInitials(session.data?.user)}
            </Avatar>
          </Tooltip>

          <Box>
            <Typography variant="body1">{session.data?.user?.name}</Typography>
            <Typography variant="subtitle2">{session.data?.user?.email}</Typography>
          </Box>

          <Menu
            id="account-menu"
            anchorEl={menuAnchorEl}
            open={menuAnchorEl !== null}
            onClose={() => setMenuAnchorEl(null)}
          >
            <MenuItem>
              <SignOutButton />
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Drawer>
  );
}
