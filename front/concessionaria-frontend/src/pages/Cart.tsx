import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface CartItem {
  id: number;
  vehicle: {
    id: number;
    model: string;
    year: number;
    color: string;
    basePrice: number;
  };
  addedAt: string;
}

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [seller, setSeller] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(60); // 1 minuto

  useEffect(() => {
    loadActiveCart();

    // Preencher automaticamente o nome do vendedor se for um vendedor
    if (user?.perfil === "VENDEDOR" && user?.nome) {
      setSeller(user.nome);
    }
  }, [user]);

  // Efeito separado para gerenciar o timer baseado nos itens do carrinho
  useEffect(() => {
    if (cartItems.length === 0) {
      setTimeLeft(60);
      return;
    }

    // Encontra o item mais antigo no carrinho
    const oldestItem = cartItems.reduce((oldest, current) => {
      const oldestTime = new Date(oldest.addedAt).getTime();
      const currentTime = new Date(current.addedAt).getTime();
      return currentTime < oldestTime ? current : oldest;
    });

    // Calcula o tempo restante baseado no item mais antigo
    const calculateTimeLeft = () => {
      const addedTime = new Date(oldestItem.addedAt).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - addedTime) / 1000);
      const remainingSeconds = 60 - elapsedSeconds; // 1 minuto = 60 segundos
      return Math.max(0, remainingSeconds);
    };

    // Define o tempo inicial
    setTimeLeft(calculateTimeLeft());

    // Iniciar timer que atualiza a cada segundo
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cartItems, navigate]);

  const loadActiveCart = async () => {
    if (!user?.cpf) {
      navigate("/");
      return;
    }

    try {
      const cartData = await cartService.getActiveCart(user.cpf);
      if (cartData && Array.isArray(cartData)) {
        setCartItems(cartData);
      } else if (cartData) {
        setCartItems([cartData]); // Se retorna item único, converte em array
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCartItems([]);
    }
  };

  const handleCheckoutAll = async () => {
    if (cartItems.length === 0) return;
    try {
      const sellerName =
        user?.perfil === "VENDEDOR"
          ? seller
          : user?.nome || user?.login || "Cliente";
      const saleType = user?.perfil === "VENDEDOR" ? "fisica" : "online";

      // Usar novo endpoint para checkout de todo o carrinho
      await cartService.checkoutAll(
        user?.cpf || "",
        sellerName,
        saleType,
        "COMUM"
      );
      navigate("/");
    } catch (error) {
      setError("Erro ao finalizar a compra");
    }
  };

  const handleCheckoutItem = async (itemId: number) => {
    try {
      const sellerName =
        user?.perfil === "VENDEDOR"
          ? seller
          : user?.nome || user?.login || "Cliente";
      const saleType = user?.perfil === "VENDEDOR" ? "fisica" : "online";

      await cartService.checkout(
        itemId.toString(),
        sellerName,
        saleType,
        "COMUM"
      );

      // Remove o item da lista local
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      setError("Erro ao finalizar a compra do item");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartService.cancel(itemId.toString());
      // Remove o item da lista local
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      setError("Erro ao remover item");
    }
  };

  const handleClearCart = async () => {
    if (!user?.cpf) return;
    try {
      await cartService.clearCart(user.cpf);
      setCartItems([]);
    } catch (error) {
      setError("Erro ao limpar carrinho");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.vehicle.basePrice, 0);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ShoppingCartIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Carrinho ({cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "itens"})
          </Typography>
          <Typography variant="subtitle1">
            Tempo restante: {formatTime(timeLeft)}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Seu carrinho está vazio
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/")}
            >
              Voltar ao Catálogo
            </Button>
          </Box>
        ) : (
          <>
            {/* Campo do vendedor se necessário */}
            {user?.perfil === "VENDEDOR" && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="seller"
                    label="Nome do Vendedor"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            )}

            {/* Lista de itens do carrinho */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.vehicle.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ano: {item.vehicle.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cor: {item.vehicle.color}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }} color="primary">
                      R$ {item.vehicle.basePrice.toLocaleString("pt-BR")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Adicionado em:{" "}
                      {new Date(item.addedAt).toLocaleString("pt-BR")}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleCheckoutItem(item.id)}
                      disabled={user?.perfil === "VENDEDOR" && !seller}
                    >
                      {user?.perfil === "VENDEDOR"
                        ? "Vender Este"
                        : "Comprar Este"}
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remover do carrinho"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>

            {/* Resumo e ações do carrinho */}
            <Box sx={{ mt: 4 }}>
              <Divider />
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumo do Carrinho
                  </Typography>
                  <Typography variant="body1">
                    Total de itens: {cartItems.length}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                    Total: R$ {getTotalPrice().toLocaleString("pt-BR")}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleClearCart}
                      sx={{ mr: 2 }}
                    >
                      Limpar Carrinho
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                      Continuar Comprando
                    </Button>
                  </Box>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={handleCheckoutAll}
                    disabled={user?.perfil === "VENDEDOR" && !seller}
                  >
                    {user?.perfil === "VENDEDOR"
                      ? "Finalizar Todas as Vendas"
                      : "Finalizar Todas as Compras"}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Cart;
