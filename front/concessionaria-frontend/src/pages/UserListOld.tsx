import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";
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
  AppBar,
  Toolbar,
  Alert,
} from "@mui/material";

interface User {
  cpf: string;
  nome: string;
  login: string;
  perfil: "VENDEDOR" | "CLIENTE";
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.perfil !== "VENDEDOR") {
      navigate("/");
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.listUsers();
      setUsers(data);
    } catch (error) {
      setError("Erro ao carregar usuários");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Lista de Usuários
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/users/create")}
          >
            Novo Usuário
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
                <TableCell>CPF</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>Perfil</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user?.document}>
                  <TableCell>{user?.document}</TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>{user?.profile}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default UserList;
