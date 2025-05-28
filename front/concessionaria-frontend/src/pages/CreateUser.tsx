import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { userService } from "../services/api";

interface CreateUserForm {
  document: string;
  name: string;
  username: string;
  password: string;
  profile: "VENDEDOR" | "CLIENTE";
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateUserForm>({
    document: "",
    name: "",
    username: "",
    password: "",
    profile: "CLIENTE",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await userService.createUser(form);
      setSuccess("Usuário criado com sucesso!");
      setForm({
        document: "",
        name: "",
        username: "",
        password: "",
        profile: "CLIENTE",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Criar Novo Usuário
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="CPF"
              name="document"
              value={form.document}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="000.000.000-00"
            />

            <TextField
              fullWidth
              label="Nome Completo"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email/Login"
              name="username"
              type="email"
              value={form.username}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Perfil</InputLabel>
              <Select
                name="profile"
                value={form.profile}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: e.target.value as "VENDEDOR" | "CLIENTE",
                  })
                }
                label="Perfil"
              >
                <MenuItem value="CLIENTE">Cliente</MenuItem>
                <MenuItem value="VENDEDOR">Vendedor</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ flex: 1 }}
              >
                {loading ? "Criando..." : "Criar Usuário"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/users")}
                sx={{ flex: 1 }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
