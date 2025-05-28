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
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

interface User {
  cpf: string;
  nome: string;
  login: string;
  perfil: "VENDEDOR" | "CLIENTE";
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.perfil !== "VENDEDOR") {
      navigate("/");
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.listUsers();
      setUsers(data);
      setError("");
    } catch (error) {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      // await userService.deleteUser(userToDelete.cpf);
      // Por enquanto, apenas remove da lista local
      setUsers(users.filter((u) => u.cpf !== userToDelete.cpf));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      setError("Erro ao excluir usuário");
    }
  };

  const handleEditClick = (user: User) => {
    navigate(`/users/edit/${user.cpf}`);
  };

  const getProfileColor = (perfil: string) => {
    return perfil === "VENDEDOR" ? "primary" : "secondary";
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Gerenciamento de Usuários
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/users/create")}
            sx={{ minWidth: 150 }}
          >
            Novo Usuário
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>CPF</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Login</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Perfil</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Nenhum usuário encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.cpf} hover>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {user.cpf}
                      </TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.perfil}
                          color={getProfileColor(user.perfil)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => handleEditClick(user)}
                            color="primary"
                            size="small"
                            title="Editar usuário"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(user)}
                            color="error"
                            size="small"
                            title="Excluir usuário"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o usuário "{userToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default UserList;
