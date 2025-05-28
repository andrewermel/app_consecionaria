import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { vehicleService } from "../services/api";

const cores = [
  { value: "branca", label: "Branca" },
  { value: "prata", label: "Prata" },
  { value: "preta", label: "Preta" },
];

export default function VehicleCreate() {
  const [form, setForm] = useState({
    model: "",
    year: "",
    basePrice: "",
    color: "branca",
    available: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await vehicleService.createVehicle({
        year: Number(form.year),
        basePrice: Number(form.basePrice),
        color: form.color,
        model: form.model,
        available: form.available,
      });
      setSuccess("Veículo cadastrado com sucesso!");
      setForm({
        model: "",
        year: "",
        basePrice: "",
        color: "branca",
        available: true,
      });
    } catch (err: any) {
      setError("Erro ao cadastrar veículo.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" mb={2}>
        Cadastrar Novo Veículo
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Modelo"
          name="model"
          value={form.model}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Ano"
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Preço Base"
          name="basePrice"
          type="number"
          value={form.basePrice}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Cor"
          name="color"
          value={form.color}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          {cores.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cadastrar
        </Button>
      </form>
    </Box>
  );
}
