import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./utils/theme";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VehicleDetails from "./pages/VehicleDetails";
import Cart from "./pages/Cart";
import UserList from "./pages/UserList";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

// Páginas extras
import VehicleCreate from "./pages/VehicleCreate";
import VehicleEdit from "./pages/VehicleEdit";
import VehicleManagement from "./pages/VehicleManagement";
import CreateUser from "./pages/CreateUser";
import UserEdit from "./pages/UserEdit";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import NewSale from "./pages/NewSale";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Sidebar>
                  <Home />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicle/:id"
            element={
              <PrivateRoute>
                <Sidebar>
                  <VehicleDetails />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Sidebar>
                  <Cart />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Sidebar>
                  <UserList />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/new"
            element={
              <PrivateRoute>
                <Sidebar>
                  <VehicleCreate />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/edit/:id"
            element={
              <PrivateRoute>
                <Sidebar>
                  <VehicleEdit />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/manage"
            element={
              <PrivateRoute>
                <Sidebar>
                  <VehicleManagement />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <PrivateRoute>
                <Sidebar>
                  <CreateUser />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/users/edit/:cpf"
            element={
              <PrivateRoute>
                <Sidebar>
                  <UserEdit />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Sidebar>
                  <Dashboard />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Sidebar>
                  <Sales />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Sidebar>
                  <Reports />
                </Sidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/new-sale"
            element={
              <PrivateRoute>
                <Sidebar>
                  <NewSale />
                </Sidebar>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
