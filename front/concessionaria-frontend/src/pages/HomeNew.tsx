import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { vehicleService } from "../services/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  Paper,
} from "@mui/material";

interface Vehicle {
  id: string;
  year: number;
  basePrice: number;
  color: "branca" | "prata" | "preta";
  model: string;
  available: boolean;
}

const colorFilters = [
  { value: "", label: "Todas as cores" },
  { value: "branca", label: "Branca" },
  { value: "prata", label: "Prata" },
  { value: "preta", label: "Preta" },
];

function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [colorFilter, setColorFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, colorFilter, searchTerm]);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.listVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (colorFilter) {
      filtered = filtered.filter((vehicle) => vehicle.color === colorFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((vehicle) =>
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Catálogo de Veículos
        </Typography>

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar por modelo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o modelo do veículo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Filtrar por cor"
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                {colorFilters.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                {filteredVehicles.length} veículo(s) encontrado(s)
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Grade de veículos */}
        <Grid container spacing={3}>
          {filteredVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      {vehicle.model}
                    </Typography>
                    <Chip
                      label={vehicle.available ? "Disponível" : "Indisponível"}
                      color={vehicle.available ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Ano: {vehicle.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cor: {vehicle.color}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    R$ {vehicle.basePrice.toLocaleString("pt-BR")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  {user?.perfil === "VENDEDOR" && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                    >
                      Editar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredVehicles.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum veículo encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente ajustar os filtros ou busque por outro modelo
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
