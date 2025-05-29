import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { vehicleService, cartService } from "../services/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  CircularProgress,
  Fab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

interface Vehicle {
  id: string;
  model: string;
  year: number;
  basePrice: number;
  color: string;
  available: boolean;
  imagem?: string;
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, selectedColor, availableOnly]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.listVehicles();
      setVehicles(data);
      setError("");
    } catch (error) {
      setError("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (availableOnly) {
      filtered = filtered.filter((v) => v.available);
    }

    if (searchTerm) {
      filtered = filtered.filter((v) =>
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedColor) {
      filtered = filtered.filter(
        (v) => v.color.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleAddToCart = async (vehicleId: string) => {
    if (!user?.cpf) {
      setError("Usuário não autenticado");
      return;
    }

    try {
      const cartData = await cartService.addToCart(vehicleId, user?.document);
      setSuccess("Veículo adicionado ao carrinho!");
      setTimeout(() => setSuccess(""), 3000);

      // Navegar para o carrinho com o cartId
      navigate("/cart", { state: { cartId: cartData.id } });
    } catch (error) {
      setError("Erro ao adicionar veículo ao carrinho");
    }
  };

  const getUniqueColors = () => {
    const colors = vehicles.map((v) => v.color).filter(Boolean);
    return [...new Set(colors)];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <DirectionsCarIcon
            sx={{ mr: 2, fontSize: 40, color: "primary.main" }}
          />
          <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
            Catálogo de Veículos
          </Typography>
          {user?.perfil === "VENDEDOR" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/vehicles/new")}
              sx={{ ml: 2 }}
            >
              Novo Veículo
            </Button>
          )}
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filtros</Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar por modelo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Cor</InputLabel>
                <Select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  label="Cor"
                >
                  <MenuItem value="">Todas as cores</MenuItem>
                  {getUniqueColors().map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Disponibilidade</InputLabel>
                <Select
                  value={availableOnly ? "available" : "all"}
                  onChange={(e) =>
                    setAvailableOnly(e.target.value === "available")
                  }
                  label="Disponibilidade"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="available">Apenas disponíveis</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedColor("");
                  setAvailableOnly(true);
                }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Lista de Veículos */}
        {!loading && (
          <Grid container spacing={3}>
            {filteredVehicles.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <DirectionsCarIcon
                    sx={{ fontSize: 64, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Nenhum veículo encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tente ajustar os filtros ou adicione novos veículos
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              filteredVehicles.map((vehicle) => (
                <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        backgroundColor: "grey.200",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {vehicle.imagem ? (
                        <img
                          src={vehicle.imagem}
                          alt={vehicle.model}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      ) : (
                        <DirectionsCarIcon
                          sx={{ fontSize: 80, color: "grey.400" }}
                        />
                      )}
                    </CardMedia>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ flexGrow: 1 }}
                        >
                          {vehicle.model}
                        </Typography>
                        <Chip
                          label={vehicle.available ? "Disponível" : "Vendido"}
                          color={vehicle.available ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Ano: {vehicle.year} • Cor: {vehicle.color}
                      </Typography>

                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        {formatPrice(vehicle.basePrice)}
                      </Typography>

                      <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                          sx={{ flexGrow: 1 }}
                        >
                          Ver Detalhes
                        </Button>

                        {vehicle.available && user?.perfil === "CLIENTE" && (
                          <Button
                            variant="contained"
                            onClick={() => handleAddToCart(vehicle.id)}
                            startIcon={<ShoppingCartIcon />}
                            sx={{ flexGrow: 1 }}
                          >
                            Adicionar
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Summary */}
        {!loading && filteredVehicles.length > 0 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredVehicles.length} de {vehicles.length} veículos
            </Typography>
          </Box>
        )}

        {/* Floating Action Button for Cart */}
        {user?.perfil === "CLIENTE" && (
          <Fab
            color="primary"
            onClick={() => navigate("/cart")}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
          >
            <ShoppingCartIcon />
          </Fab>
        )}
      </Box>
    </Container>
  );
}
