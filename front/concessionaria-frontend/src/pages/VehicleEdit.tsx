import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { vehicleService } from "../services/api";

interface VehicleForm {
  model: string;
  year: number;
  basePrice: number;
  color: string;
}

const cores = [
  { value: "branca", label: "Branca" },
  { value: "prata", label: "Prata" },
  { value: "preta", label: "Preta" },
];

export default function VehicleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<VehicleForm>({
    model: "",
    year: new Date().getFullYear(),
    basePrice: 0,
    color: "branca",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      const vehicle = await vehicleService.getVehicle(id!);
      setForm({
        model: vehicle.modelo,
        year: vehicle.ano,
        basePrice: vehicle.preco,
        color: vehicle.cor,
      });
    } catch (error) {
      setError("Erro ao carregar dados do veículo");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "year" || name === "basePrice" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const vehicleData = {
        modelo: form.model,
        ano: form.year,
        basePrice: form.basePrice,
        cor: form.color,
        available: true,
      };

      await vehicleService.updateVehicle(id!, vehicleData);
      setSuccess("Veículo atualizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao atualizar veículo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Editar Veículo
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Modelo"
              name="model"
              value={form.model}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Ano"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />

            <TextField
              fullWidth
              label="Preço Base"
              name="basePrice"
              type="number"
              value={form.basePrice}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              select
              fullWidth
              label="Cor"
              name="color"
              value={form.color}
              onChange={handleChange}
              margin="normal"
              required
            >
              {cores.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{ flex: 1 }}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{ flex: 1 }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
