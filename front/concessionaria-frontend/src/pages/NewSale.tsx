import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add, ShoppingCart, Delete } from "@mui/icons-material";
import { vehicleService, cartService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Vehicle {
  id: number;
  year: number;
  basePrice: number;
  color: string;
  model: string;
  available: boolean;
}

interface CartItem {
  id: number;
  vehicle: Vehicle;
  client: string;
  addedAt: string;
}

export default function NewSale() {
  const { user } = useAuth();

  // Debug: verificar se usuário está logado e se tem token
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Debug NewSale:");
    console.log("  - User:", user);
    console.log("  - Token exists:", !!token);
    console.log("  - Token length:", token?.length || 0);
    if (!token) {
      console.log("❌ PROBLEMA: Usuário não está logado! Faça login primeiro.");
    }
  }, [user]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isVipClient, setIsVipClient] = useState(false);

  // Define se é venda (VENDEDOR) ou compra (CLIENTE)
  const isVendor = user?.perfil === "VENDEDOR";
  const pageTitle = isVendor ? "Nova Venda" : "Comprar Veículos";
  const cartButtonText = isVendor ? "Finalizar Venda" : "Finalizar Compra";

  useEffect(() => {
    fetchVehicles();
    if (user?.cpf) {
      fetchCart();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.listVehicles();
      // Filtra apenas veículos disponíveis
      setVehicles(data.filter((v: Vehicle) => v.available));
    } catch (err) {
      setError("Erro ao buscar veículos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      if (user?.cpf) {
        const data = await cartService.getActiveCart(user.cpf);
        // A API retorna um objeto Cart, não um array, então convertemos para array
        if (data && data.id) {
          setCartItems([data]); // Coloca o item único em um array
        } else {
          setCartItems([]);
        }
      }
    } catch (err) {
      console.log(
        "ℹ️ Nenhum carrinho ativo encontrado (normal se não houver itens)"
      );
      setCartItems([]);
    }
  };

  const addToCart = async (vehicleId: number) => {
    if (!user?.cpf) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      console.log(
        `🛒 Adicionando veículo ${vehicleId} ao carrinho para cliente ${user.cpf}...`
      );

      // Adiciona ao carrinho - retorna o carrinho criado
      const cartData = await cartService.addToCart(
        vehicleId.toString(),
        user.cpf
      );

      console.log("✅ Veículo adicionado ao carrinho:", cartData);

      // Atualiza o estado do carrinho com o resultado
      if (cartData && cartData.id) {
        setCartItems([cartData]);
      }

      // Atualiza lista de veículos para remover o que foi adicionado
      await fetchVehicles();
    } catch (err) {
      console.error("❌ Erro ao adicionar ao carrinho:", err);
      setError("Erro ao adicionar veículo ao carrinho.");
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartService.cancel(cartItemId.toString());
      await fetchCart();
      await fetchVehicles(); // Atualiza lista para mostrar veículo disponível novamente
    } catch (err) {
      setError("Erro ao remover veículo do carrinho.");
    }
  };

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError("Carrinho vazio!");
      return;
    }

    if (!user?.cpf) {
      setError("Usuário não identificado.");
      return;
    }

    setCheckoutLoading(true);
    try {
      console.log("🛒 Iniciando checkout...");

      // Para cada item no carrinho, fazemos o checkout
      for (const item of cartItems) {
        const clientType = isVipClient ? "VIP" : "COMUM";

        // Define seller baseado no perfil do usuário
        const seller = isVendor ? user.cpf : "vendedor1";

        console.log(`💳 Checkout do carrinho ${item.id}:`, {
          cartId: item.id,
          seller: seller,
          type: "online",
          clientType: clientType,
        });

        await cartService.checkout(
          item.id.toString(),
          seller,
          "online",
          clientType
        );

        console.log(`✅ Checkout concluído para carrinho ${item.id}`);
      }

      setCartItems([]);
      setCartDialogOpen(false);
      await fetchVehicles(); // Atualiza lista
      setError("");

      const successMessage = isVendor
        ? "Venda finalizada com sucesso!"
        : "Compra finalizada com sucesso!";

      console.log("🎉", successMessage);
      alert(successMessage);
    } catch (err) {
      console.error("❌ Erro no checkout:", err);
      setError("Erro ao finalizar operação.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getTotalPrice = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + item.vehicle.basePrice, 0);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          {pageTitle}
        </Typography>

        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={() => setCartDialogOpen(true)}
          disabled={!cartItems || cartItems.length === 0}
        >
          Carrinho ({cartItems ? cartItems.length : 0})
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lista de Veículos */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={3}
      >
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {vehicle.model}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ano: {vehicle.year}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cor: {vehicle.color}
              </Typography>

              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                {formatPrice(vehicle.basePrice)}
              </Typography>

              <Chip
                label="Disponível"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>

            <CardActions>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => addToCart(vehicle.id)}
                fullWidth
              >
                {isVendor ? "Adicionar à Venda" : "Adicionar ao Carrinho"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {vehicles.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Nenhum veículo disponível no momento.
          </Typography>
        </Box>
      )}

      {/* Dialog do Carrinho */}
      <Dialog
        open={cartDialogOpen}
        onClose={() => setCartDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isVendor ? "Itens da Venda" : "Seu Carrinho"}
        </DialogTitle>

        <DialogContent>
          {!cartItems || cartItems.length === 0 ? (
            <Typography variant="body1" textAlign="center" py={3}>
              Carrinho vazio
            </Typography>
          ) : (
            <List>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.vehicle.model} - ${item.vehicle.color}`}
                      secondary={`Ano: ${item.vehicle.year} | ${formatPrice(
                        item.vehicle.basePrice
                      )}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </div>
              ))}

              <Divider sx={{ my: 2 }} />

              <ListItem>
                <ListItemText
                  primary="Total"
                  secondary={formatPrice(getTotalPrice())}
                  primaryTypographyProps={{ variant: "h6" }}
                  secondaryTypographyProps={{ variant: "h5", color: "primary" }}
                />
              </ListItem>

              {/* Opção Cliente VIP apenas para vendedores */}
              {isVendor && (
                <ListItem>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isVipClient}
                        onChange={(e) => setIsVipClient(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Cliente VIP (desconto especial)"
                  />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCartDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={!cartItems || cartItems.length === 0 || checkoutLoading}
            startIcon={
              checkoutLoading ? <CircularProgress size={20} /> : undefined
            }
          >
            {cartButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
