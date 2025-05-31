import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { vehicleService, userService, salesService } from "../services/api";

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalUsers: number;
  totalSales: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    totalUsers: 0,
    totalSales: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [vehiclesData, usersData, salesData] = await Promise.all([
        vehicleService.listVehicles(),
        user?.perfil === "VENDEDOR"
          ? userService.listUsers()
          : Promise.resolve([]),
        salesService.getAllSales(),
      ]);

      setStats({
        totalVehicles: vehiclesData.length,
        availableVehicles: vehiclesData.filter((v: any) => v.available).length,
        totalUsers: usersData.length,
        totalSales: salesData.length,
      });
    } catch (error) {
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color = "primary",
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: "primary" | "secondary" | "success" | "warning" | "error";
  }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 2, color: `${color}.main` }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" color={`${color}.main`}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container>
        <Typography>Carregando dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <StatCard
              title="Total de Veículos"
              value={stats.totalVehicles}
              icon={<DirectionsCarIcon fontSize="large" />}
              color="primary"
            />
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <StatCard
              title="Veículos Disponíveis"
              value={stats.availableVehicles}
              icon={<DirectionsCarIcon fontSize="large" />}
              color="success"
            />
          </Box>

          {user?.perfil === "VENDEDOR" && (
            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <StatCard
                title="Total de Usuários"
                value={stats.totalUsers}
                icon={<PeopleIcon fontSize="large" />}
                color="secondary"
              />
            </Box>
          )}

          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <StatCard
              title="Vendas Realizadas"
              value={stats.totalSales}
              icon={<ReceiptIcon fontSize="large" />}
              color="warning"
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: "1 1 400px" }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo de Vendas
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="body1">
                    {stats.totalSales} vendas realizadas no sistema
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Taxa de conversão:{" "}
                  {stats.totalVehicles > 0
                    ? ((stats.totalSales / stats.totalVehicles) * 100).toFixed(
                        1
                      )
                    : 0}
                  %
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: "1 1 400px" }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Estoque de Veículos
                </Typography>
                <Typography variant="body1">
                  {stats.availableVehicles} de {stats.totalVehicles} veículos
                  disponíveis
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {stats.totalVehicles - stats.availableVehicles} veículos
                  vendidos ou reservados
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
