import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

interface User {
  cpf: string;
  nome: string;
  login: string;
  perfil: "VENDEDOR" | "CLIENTE";
  vip?: boolean;
}

// Interface para o JWT que vem do backend (ainda em português)
interface JWTUser {
  cpf?: string;
  document?: string;
  nome?: string;
  name?: string;
  login?: string;
  username?: string;
  perfil?: "VENDEDOR" | "CLIENTE";
  profile?: "VENDEDOR" | "CLIENTE";
  vip?: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Função para mapear campos do JWT (português) para a interface User (português)
  const mapJWTToUser = (jwtData: JWTUser): User => {
    return {
      cpf: jwtData.cpf || jwtData.document || "",
      nome: jwtData.nome || jwtData.name || "",
      login: jwtData.login || jwtData.username || "",
      perfil: jwtData.perfil || jwtData.profile || "CLIENTE",
      vip: jwtData.vip || false,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as JWTUser;
        const mappedUser = mapJWTToUser(decoded);
        setUser(mappedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token) as JWTUser;
    const mappedUser = mapJWTToUser(decoded);
    setUser(mappedUser);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
