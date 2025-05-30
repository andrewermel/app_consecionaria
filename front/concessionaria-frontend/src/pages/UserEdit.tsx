import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface UserFormData {
  cpf: string;
  nome: string;
  login: string;
  perfil: "VENDEDOR" | "CLIENTE";
  senha?: string;
  vip: boolean;
}

export default function UserEdit() {
  const { cpf } = useParams<{ cpf: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<UserFormData>({
    cpf: "",
    nome: "",
    login: "",
    perfil: "CLIENTE",
    vip: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.perfil !== "VENDEDOR") {
      navigate("/");
      return;
    }

    if (cpf) {
      loadUser();
    }
  }, [cpf, user, navigate]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUser(cpf!);
      // Backend retorna campos em inglês, mapeando para português no frontend
      setFormData({
        cpf: userData.document,
        nome: userData.name,
        login: userData.username,
        perfil: userData.profile,
        vip: userData.vip || false,
      });
      setError("");
    } catch (error) {
      setError("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserFormData) => (event: any) => {
    const value = field === "vip" ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.login) {
      setError("Nome e login são obrigatórios");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await userService.updateUser(cpf!, {
        name: formData.nome,
        username: formData.login,
        profile: formData.perfil,
        password: formData.senha,
        vip: formData.vip,
      });

      // Simulação de delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Usuário atualizado com sucesso!");

      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      setError("Erro ao atualizar usuário");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            onClick={() => navigate("/users")}
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Voltar
          </Button>
          <PersonIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Editar Usuário
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="CPF"
              value={formData.cpf}
              disabled
              margin="normal"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={handleChange("nome")}
              required
              margin="normal"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Login"
              value={formData.login}
              onChange={handleChange("login")}
              required
              margin="normal"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Perfil</InputLabel>
              <Select
                value={formData.perfil}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    perfil: e.target.value as "VENDEDOR" | "CLIENTE",
                  });
                }}
                label="Perfil"
              >
                <MenuItem value="CLIENTE">Cliente</MenuItem>
                <MenuItem value="VENDEDOR">Vendedor</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.vip}
                  onChange={handleChange("vip")}
                  name="vip"
                />
              }
              label={`${
                formData.perfil === "CLIENTE" ? "Cliente" : "Vendedor"
              } VIP (10% de desconto)`}
              sx={{ mt: 1, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Nova Senha (opcional)"
              type="password"
              value={formData.senha || ""}
              onChange={handleChange("senha")}
              margin="normal"
              sx={{ mb: 3 }}
              helperText="Deixe em branco para manter a senha atual"
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/users")}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
