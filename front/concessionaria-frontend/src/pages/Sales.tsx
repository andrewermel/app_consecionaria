import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { salesService } from "../services/api";

interface Vehicle {
  id: number;
  year: number;
  basePrice: number;
  color: string;
  model: string;
  available: boolean;
}

interface Sale {
  id: number;
  type: string;
  client: string;
  seller?: string;
  vehicle: Vehicle;
  date: string;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSales() {
      try {
        console.log("Tentando buscar vendas...");
        const res = await salesService.getAllSales();
        console.log("Vendas recebidas:", res);
        setSales(res);
      } catch (err) {
        console.error("Erro ao buscar vendas:", err);
        setError("Erro ao buscar vendas.");
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Vendas Realizadas
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Veículo</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.type}</TableCell>
                  <TableCell>{sale.client}</TableCell>
                  <TableCell>{sale.seller || "-"}</TableCell>
                  <TableCell>
                    {sale.vehicle.model} - {sale.vehicle.color} (
                    {sale.vehicle.year})
                  </TableCell>
                  <TableCell>
                    R${" "}
                    {sale.vehicle.basePrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
