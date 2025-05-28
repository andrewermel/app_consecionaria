import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cartService } from "../services/api";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface CartItem {
  id: string;
  vehicle: {
    id: string;
    model: string;
    year: number;
    color: string;
    basePrice: number;
  };
  validUntil: string;
}

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem | null>(null);
  const [error, setError] = useState("");
  const [seller, setSeller] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const cartId = location.state?.cartId;
    if (cartId) {
      // Se há cartId, carrega os dados do carrinho
      loadCart(cartId);
    } else {
      // Se não há cartId, tenta buscar carrinho ativo do usuário
      loadActiveCart();
    }

    // Iniciar timer de 1 minuto apenas se há cartId
    if (cartId) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location.state?.cartId]);

  const loadCart = async (cartId: string) => {
    try {
      const cartData = await cartService.getCart(cartId);
      setCart(cartData);
    } catch (error) {
      setError("Erro ao carregar carrinho");
      navigate("/");
    }
  };

  const loadActiveCart = async () => {
    if (!user?.cpf) {
      navigate("/");
      return;
    }

    try {
      const cartData = await cartService.getActiveCart(user.cpf);
      if (cartData) {
        setCart(cartData);
        // Se encontrou carrinho ativo, iniciar timer
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Se não há carrinho ativo, mostrar mensagem
        setError("Nenhum carrinho ativo encontrado");
      }
    } catch (error) {
      setError("Erro ao carregar carrinho ativo");
    }
  };

  const handleCheckout = async () => {
    if (!cart) return;
    try {
      const sellerName =
        user?.perfil === "VENDEDOR"
          ? seller
          : user?.nome || user?.login || "Cliente";
      const saleType = user?.perfil === "VENDEDOR" ? "fisica" : "online";
      await cartService.checkout(cart.id, sellerName, saleType, "COMUM");
      navigate("/");
    } catch (error) {
      setError("Erro ao finalizar a compra");
    }
  };

  const handleCancel = async () => {
    if (!cart) return;
    try {
      await cartService.cancel(cart.id);
      navigate("/");
    } catch (error) {
      setError("Erro ao cancelar");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Carrinho
          </Typography>
          <Typography variant="subtitle1">
            Tempo restante: {timeLeft}s
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {cart && (
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {cart.vehicle.model}
              </Typography>
              <Typography variant="body1">Ano: {cart.vehicle.year}</Typography>
              <Typography variant="body1">Cor: {cart.vehicle.color}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                R$ {cart.vehicle.basePrice.toLocaleString("pt-BR")}
              </Typography>

              {user?.perfil === "VENDEDOR" && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="seller"
                  label="Nome do Vendedor"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                />
              )}
            </CardContent>
            <CardActions>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={user?.perfil === "VENDEDOR" && !seller}
              >
                {user?.perfil === "VENDEDOR"
                  ? "Efetivar Venda"
                  : "Efetivar Compra"}
              </Button>
              <Button size="large" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            </CardActions>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default Cart;
