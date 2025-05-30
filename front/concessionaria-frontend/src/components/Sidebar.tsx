import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  DirectionsCar as DirectionsCarIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  ManageAccounts as ManageAccountsIcon,
  AddShoppingCart as AddShoppingCartIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

interface SidebarProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    text: "Catálogo",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    text: "Carrinho",
    icon: <ShoppingCartIcon />,
    path: "/cart",
    roles: ["CLIENTE", "VENDEDOR"],
  },
  {
    text: "Nova Venda/Compra",
    icon: <AddShoppingCartIcon />,
    path: "/new-sale",
    roles: ["VENDEDOR", "CLIENTE"],
  },
  {
    text: "Gerenciar Veículos",
    icon: <DirectionsCarIcon />,
    path: "/vehicles/manage",
    roles: ["VENDEDOR"],
  },
  {
    text: "Novo Veículo",
    icon: <AddIcon />,
    path: "/vehicles/new",
    roles: ["VENDEDOR"],
  },
  {
    text: "Usuários",
    icon: <PeopleIcon />,
    path: "/users",
    roles: ["VENDEDOR"],
  },
  {
    text: "Novo Usuário",
    icon: <ManageAccountsIcon />,
    path: "/users/create",
    roles: ["VENDEDOR"],
  },
  {
    text: "Vendas",
    icon: <TrendingUpIcon />,
    path: "/sales",
    roles: ["VENDEDOR"],
  },
  {
    text: "Relatórios",
    icon: <AssessmentIcon />,
    path: "/reports",
    roles: ["VENDEDOR"],
  },
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["VENDEDOR"],
  },
];

export default function Sidebar({ children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getUserDisplayName = () => {
    return user?.nome || user?.login || "Usuário";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getFilteredMenuItems = () => {
    return menuItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.perfil || "");
    });
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <DirectionsCarIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" noWrap component="div">
            Concessionária
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
            {getUserInitials()}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {getUserDisplayName()}
            </Typography>
            <Chip
              label={user?.perfil || "Usuário"}
              color={user?.perfil === "VENDEDOR" ? "primary" : "secondary"}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
      <Divider />

      <List>
        {getFilteredMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
                "&:hover": {
                  backgroundColor: "primary.lighter",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Concessionária
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
