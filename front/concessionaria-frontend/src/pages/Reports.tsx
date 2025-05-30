import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { vehicleService, salesService, userService } from "../services/api";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DownloadIcon from "@mui/icons-material/Download";

interface ReportData {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  salesByMonth: Array<{ month: string; sales: number; revenue: number }>;
  topVehicles: Array<{ modelo: string; sales: number }>;
  recentSales: Array<{
    id: string;
    vehicleModel: string;
    date: string;
    price: number;
    client: string;
  }>;
}

export default function Reports() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0,
    salesByMonth: [],
    topVehicles: [],
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("User no Reports:", user);
    console.log("Perfil do usuário:", user?.perfil);
    // Verificação corrigida: usar 'perfil' em vez de 'profile'
    if (user?.perfil !== "VENDEDOR") {
      console.log("Acesso negado - perfil:", user?.perfil);
      setError("Acesso negado. Apenas vendedores podem acessar relatórios.");
      setLoading(false);
      return;
    }
    console.log("Acesso permitido, carregando dados...");
    loadReportData();
  }, [user]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, salesData, usersData] = await Promise.all([
        vehicleService.listVehicles(),
        salesService.getAllSales(),
        userService.listUsers(),
      ]);

      // Processar dados para o relatório
      const availableVehicles = vehiclesData.filter((v: any) => v.available);
      const soldVehicles = vehiclesData.filter((v: any) => !v.available);

      // Calcular receita total (simulado)
      const totalRevenue = salesData.reduce((sum: number, sale: any) => {
        return sum + (sale.price || 50000); // Preço simulado se não disponível
      }, 0);

      // Simular dados de vendas por mês (últimos 6 meses)
      const salesByMonth = generateMonthlySalesData(salesData.length);

      // Simular veículos mais vendidos
      const topVehicles = generateTopVehiclesData(vehiclesData);

      // Simular vendas recentes
      const recentSales = generateRecentSalesData(salesData, vehiclesData);

      setReportData({
        totalVehicles: vehiclesData.length,
        availableVehicles: availableVehicles.length,
        soldVehicles: soldVehicles.length,
        totalSales: salesData.length,
        totalRevenue,
        totalUsers: usersData.length,
        salesByMonth,
        topVehicles,
        recentSales,
      });

      setError("");
    } catch (error) {
      setError("Erro ao carregar dados do relatório");
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlySalesData = (totalSales: number) => {
    const months = ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr"];
    return months.map((month) => ({
      month,
      sales: Math.floor(Math.random() * (totalSales / 2)) + 1,
      revenue: Math.floor(Math.random() * 500000) + 100000,
    }));
  };

  const generateTopVehiclesData = (vehicles: any[]) => {
    return vehicles.slice(0, 5).map((vehicle) => ({
      modelo: vehicle.model,
      sales: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const generateRecentSalesData = (sales: any[], vehicles: any[]) => {
    return sales.slice(0, 10).map((sale, index) => {
      const vehicle = vehicles[index % vehicles.length];
      return {
        id: sale.id || `sale_${index}`,
        vehicleModel: vehicle?.model || "Modelo não encontrado",
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("pt-BR"),
        price: vehicle?.basePrice || Math.floor(Math.random() * 100000) + 30000,
        client: `Cliente ${index + 1}`,
      };
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleExportReport = () => {
    // Simular export de relatório
    const reportContent = `
Relatório de Vendas - ${new Date().toLocaleDateString("pt-BR")}
========================================

RESUMO GERAL:
- Total de Veículos: ${reportData.totalVehicles}
- Veículos Disponíveis: ${reportData.availableVehicles}
- Veículos Vendidos: ${reportData.soldVehicles}
- Total de Vendas: ${reportData.totalSales}
- Receita Total: ${formatCurrency(reportData.totalRevenue)}
- Total de Usuários: ${reportData.totalUsers}

VENDAS RECENTES:
${reportData.recentSales
  .map(
    (sale) =>
      `- ${sale.vehicleModel} - ${formatCurrency(sale.price)} - ${sale.date}`
  )
  .join("\n")}
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_vendas_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BarChartIcon sx={{ mr: 2, fontSize: 40, color: "primary.main" }} />
            <Typography variant="h3" component="h1">
              Relatórios e Analytics
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportReport}
          >
            Exportar Relatório
          </Button>
        </Box>

        {/* Métricas Principais */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: "250px" }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Total Veículos</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {reportData.totalVehicles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reportData.availableVehicles} disponíveis
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: "250px" }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="h6">Vendas Total</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {reportData.totalSales}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este mês: {Math.floor(reportData.totalSales / 6)}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: "250px" }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: "warning.main" }} />
                  <Typography variant="h6">Receita Total</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {formatCurrency(reportData.totalRevenue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Média:{" "}
                  {formatCurrency(
                    reportData.totalRevenue / reportData.totalSales || 0
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: "250px" }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: "info.main" }} />
                  <Typography variant="h6">Usuários</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {reportData.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes ativos
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* Vendas por Mês */}
          <Box sx={{ flex: 1, minWidth: "400px" }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Vendas por Mês
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mês</TableCell>
                      <TableCell align="right">Vendas</TableCell>
                      <TableCell align="right">Receita</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.salesByMonth.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell align="right">{row.sales}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Veículos Mais Vendidos */}
          <Box sx={{ flex: 1, minWidth: "400px" }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Veículos Mais Vendidos
              </Typography>
              <Box>
                {reportData.topVehicles.map((vehicle, index) => (
                  <Box key={vehicle.modelo} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">{vehicle.modelo}</Typography>
                      <Chip
                        label={`${vehicle.sales} vendas`}
                        color={index === 0 ? "primary" : "default"}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        height: 4,
                        backgroundColor: "grey.200",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          backgroundColor:
                            index === 0 ? "primary.main" : "grey.400",
                          width: `${
                            (vehicle.sales /
                              Math.max(
                                ...reportData.topVehicles.map((v) => v.sales)
                              )) *
                            100
                          }%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Vendas Recentes */}
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vendas Recentes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Veículo</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="right">Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.recentSales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {sale.vehicleModel}
                        </Typography>
                      </TableCell>
                      <TableCell>{sale.client}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="medium"
                        >
                          {formatCurrency(sale.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{sale.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
