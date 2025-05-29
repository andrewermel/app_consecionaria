import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { vehicleService, cartService } from "../services/api";
import {
  Container,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaletteIcon from "@mui/icons-material/Palette";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface Vehicle {
  id: string;
  year: number;
  basePrice: number;
  color: string;
  model: string;
  available?: boolean;
  imagem?: string;
  descricao?: string;
}

function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    if (!id) return;
    try {
      const data = await vehicleService.getVehicle(id);
      setVehicle(data);
      setError("");
    } catch (error) {
      setError("Erro ao carregar dados do veículo");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!vehicle || !user?.cpf) {
      setError("Erro: dados do usuário ou veículo não encontrados");
      return;
    }

    try {
      const cartData = await cartService.addToCart(vehicle.id, user?.document);
      setSuccess("Veículo adicionado ao carrinho com sucesso!");
      setTimeout(() => setSuccess(""), 3000);

      // Navegar para o carrinho com o cartId
      navigate("/cart", { state: { cartId: cartData.id } });
    } catch (error) {
      setError("Erro ao adicionar veículo ao carrinho");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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

  if (!vehicle) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Veículo não encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Detalhes do Veículo
          </Typography>
          {user?.perfil === "VENDEDOR" && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
            >
              Editar
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

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Image */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="div"
                sx={{
                  height: 400,
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
                    sx={{ fontSize: 120, color: "grey.400" }}
                  />
                )}
              </CardMedia>
            </Card>
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h3" component="h2" sx={{ flexGrow: 1 }}>
                  {vehicle.model}
                </Typography>
                <Chip
                  label={vehicle.available !== false ? "Disponível" : "Vendido"}
                  color={vehicle.available !== false ? "success" : "error"}
                  variant="filled"
                />
              </Box>

              <Typography
                variant="h4"
                color="primary"
                sx={{ mb: 3, fontWeight: "bold" }}
              >
                {formatPrice(vehicle.basePrice)}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Specs */}
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ano
                      </Typography>
                      <Typography variant="h6">{vehicle.year}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Cor
                      </Typography>
                      <Typography variant="h6">{vehicle.color}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {vehicle.descricao && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Descrição
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {vehicle.descricao}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ mb: 3 }} />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {vehicle.available !== false && user?.perfil === "CLIENTE" && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{ flex: 1 }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                )}

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/cart")}
                  sx={{ flex: { xs: 1, sm: "0 0 auto" } }}
                >
                  Ver Carrinho
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações Adicionais
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box
                sx={{ flex: 1, minWidth: "200px", textAlign: "center", p: 2 }}
              >
                <AttachMoneyIcon
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6">Financiamento</Typography>
                <Typography variant="body2" color="text.secondary">
                  Condições especiais disponíveis
                </Typography>
              </Box>

              <Box
                sx={{ flex: 1, minWidth: "200px", textAlign: "center", p: 2 }}
              >
                <DirectionsCarIcon
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6">Test Drive</Typography>
                <Typography variant="body2" color="text.secondary">
                  Agende um test drive
                </Typography>
              </Box>

              <Box
                sx={{ flex: 1, minWidth: "200px", textAlign: "center", p: 2 }}
              >
                <Typography variant="h6">Garantia</Typography>
                <Typography variant="body2" color="text.secondary">
                  Garantia de fábrica inclusa
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default VehicleDetails;
