import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CabinIcon from '@mui/icons-material/Cabin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import PageviewOutlinedIcon from '@mui/icons-material/PageviewOutlined';
import LogoutButton from './withLogout';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import withLogin, { DecodedToken } from '@/components/general/withLogin';

type Props = { children: ReactNode }

const drawerItems = [
  { name: 'View Truck Status', path: '/view' },
  { name: 'Orders', path: '/' },
  { name: 'Trucks', path: '/trucks' },
  { name: 'Vendor Sourcing', path: '/vendorsourcing' },
  { name: 'Status Update', path: '/statusupdate' },
  { name: 'Users', path: '/user' },
  { name: 'Dropdown Master', path: '/dropdownmaster' },
  { name: 'Checklist', path: '/checklist' },
]

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout = ({ children, roles }: Props & DecodedToken) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()

  const togggleDrawer = () => {
    setOpen((open) => !open)
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const visibleDrawerItemsForManager =
    drawerItems.filter(item => item.name !== 'Users' && item.name !== 'Dropdown Master' && item.name !== 'Checklist')

  const visibleDrawerItemsForOperator = drawerItems.filter(item => item.name !== 'Users' && item.name !== 'Dropdown Master' && item.name !== 'Checklist' && item.name !== 'Orders' && item.name !== "Vendor Sourcing" && item.name !== "Trucks" && item.name !== "Status Update")

  const drawerItemsToShowBasedOnRole = roles === 'editor' ? visibleDrawerItemsForManager : roles === 'viewer' ? visibleDrawerItemsForOperator : drawerItems

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>

        <Toolbar
          style={{
            backgroundColor: "#E96820",
            fontSize: "13px"
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={togggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
            Home
            <LogoutButton />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton sx={{ width: '100%' }} onClick={handleDrawerClose}>
            <img
              src={"/images/toyota-lift.png"}
              alt="Logo"
              style={{ width: '80%', height: '40px', marginRight: '10px' }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerItemsToShowBasedOnRole.map((item, index) => (
            <ListItem key={item.name} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>
                  {index === 0
                    ? <PageviewOutlinedIcon />
                    : index === 1
                      ? <DashboardIcon
                      />
                      : index === 2
                        ? <LocalShippingOutlinedIcon />
                        : index === 3
                          ? <BuildCircleOutlinedIcon />
                          : index === 4
                            ? <CabinIcon />
                            : index === 5
                              ? <PeopleIcon />
                              : index === 6
                                ? <ArrowDropDownCircleOutlinedIcon />
                                : <ChecklistRoundedIcon />
                  }                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <img
          src={"/images/truck-img.png"}
          alt="Logo"
          style={{ width: '80%', height: '35px', marginRight: '10px', marginLeft: '10px', position: 'absolute', bottom: 5 }}
        /> */}
      </Drawer>
      <Main open={open} sx={{ backgroundColor: '#a9a8a9', height: '100vh' }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}

export default withLogin(Layout)