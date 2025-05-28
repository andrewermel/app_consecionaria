import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { vehicleService } from "../services/api";

interface Vehicle {
  id: string;
  model: string;
  year: number;
  basePrice: number;
  color: string;
  available: boolean;
}

export default function VehicleManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    vehicle: Vehicle | null;
  }>({
    open: false,
    vehicle: null,
  });

  useEffect(() => {
    if (user?.perfil !== "VENDEDOR") {
      navigate("/");
      return;
    }
    loadVehicles();
  }, [user, navigate]);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.listVehicles();
      setVehicles(data);
    } catch (error) {
      setError("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicleId: string) => {
    navigate(`/vehicles/edit/${vehicleId}`);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setDeleteDialog({ open: true, vehicle });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.vehicle) return;

    try {
      await vehicleService.deleteVehicle(deleteDialog.vehicle.id);
      setDeleteDialog({ open: false, vehicle: null });
      loadVehicles(); // Recarrega a lista
    } catch (error) {
      setError("Erro ao deletar veículo");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, vehicle: null });
  };

  if (loading) {
    return (
      <Container>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Gerenciar Veículos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/vehicles/new")}
          >
            Novo Veículo
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Cor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    R$ {vehicle.basePrice.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>{vehicle.color}</TableCell>
                  <TableCell>
                    <Chip
                      label={vehicle.available ? "Disponível" : "Indisponível"}
                      color={vehicle.available ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(vehicle.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(vehicle)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o veículo{" "}
            <strong>{deleteDialog.vehicle?.model}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
