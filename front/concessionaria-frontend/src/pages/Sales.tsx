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

interface Sale {
  id: string;
  tipo: string;
  cliente: string;
  vendedor?: string;
  veiculo: string;
  data: string;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await salesService.getAllSales();
        setSales(res);
      } catch (err) {
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
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.tipo}</TableCell>
                  <TableCell>{sale.cliente}</TableCell>
                  <TableCell>{sale.vendedor || "-"}</TableCell>
                  <TableCell>{sale.veiculo}</TableCell>
                  <TableCell>{sale.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
