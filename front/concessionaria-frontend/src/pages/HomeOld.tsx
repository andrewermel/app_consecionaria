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
} from "@mui/material";

interface Vehicle {
  id: string;
  ano: number;
  preco: number;
  cor: "branca" | "prata" | "preta";
  modelo: string;
}

function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.listVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Concessionária
          </Typography>
          {user?.perfil === "VENDEDOR" && (
            <Button color="inherit" onClick={() => navigate("/users")}>
              Listar Usuários
            </Button>
          )}
          <Button color="inherit" onClick={logout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {vehicle.modelo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ano: {vehicle.ano}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cor: {vehicle.cor}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    R$ {vehicle.preco.toLocaleString("pt-BR")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
