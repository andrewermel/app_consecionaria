import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

const vehicleApi = axios.create({
  baseURL: "/",
});

// Log de requisições
api.interceptors.request.use((config) => {
  console.log("Request:", {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
  });
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

vehicleApi.interceptors.request.use((config) => {
  console.log("🚗 VehicleApi Request:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
  });

  const token = localStorage.getItem("token");
  console.log(
    "🔑 Token from localStorage:",
    token ? "Token exists" : "No token found"
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header added");
  } else {
    console.log("❌ No token - request will fail with 403");
  }

  return config;
});

vehicleApi.interceptors.response.use(
  (response) => {
    console.log("✅ VehicleApi Success:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ VehicleApi Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      hasAuthHeader: !!error.config?.headers?.Authorization,
    });
    throw error;
  }
);

// Log de respostas
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    try {
      console.log("Tentando login com:", { username, password });
      const response = await api.post("/auth/login", { username, password });
      console.log("Resposta do login:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },
};

export const vehicleService = {
  listVehicles: async () => {
    const response = await vehicleApi.get("/vehicles");
    return response.data;
  },

  getVehicle: async (id: string) => {
    const response = await vehicleApi.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: any) => {
    const response = await vehicleApi.post("/vehicles", data);
    return response.data;
  },

  updateVehicle: async (id: string, data: any) => {
    const response = await vehicleApi.put(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string) => {
    const response = await vehicleApi.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export const cartService = {
  addToCart: async (vehicleId: string, client: string) => {
    const response = await vehicleApi.post("/cart", null, {
      params: { vehicleId, client },
    });
    return response.data;
  },

  getCart: async (cartId: string) => {
    const response = await vehicleApi.get(`/cart/${cartId}`);
    return response.data;
  },

  getActiveCart: async (client: string) => {
    const response = await vehicleApi.get(`/cart/active/${client}`);
    return response.data;
  },

  checkout: async (
    cartId: string,
    seller: string,
    type: "online" | "fisica",
    clientType: string = "COMUM"
  ) => {
    const response = await vehicleApi.post(`/cart/${cartId}/checkout`, null, {
      params: { seller, type, clientType },
    });
    return response.data;
  },

  cancel: async (cartId: string) => {
    const response = await vehicleApi.post(`/cart/${cartId}/cancel`);
    return response.data;
  },

  checkoutAll: async (
    client: string,
    seller: string,
    type: "online" | "fisica",
    clientType: string = "COMUM"
  ) => {
    const response = await vehicleApi.post(
      `/cart/checkout-all/${client}`,
      null,
      {
        params: { seller, type, clientType },
      }
    );
    return response.data;
  },

  clearCart: async (client: string) => {
    const response = await vehicleApi.post(`/cart/clear/${client}`);
    return response.data;
  },
};

export const userService = {
  listUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUser: async (cpf: string) => {
    const response = await api.get(`/users/${cpf}`);
    return response.data;
  },

  createUser: async (userData: {
    document: string;
    name: string;
    username: string;
    password: string;
    profile: "VENDEDOR" | "CLIENTE";
    vip?: boolean;
  }) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (
    cpf: string,
    userData: {
      name?: string;
      username?: string;
      profile?: "VENDEDOR" | "CLIENTE";
      password?: string;
      vip?: boolean;
    }
  ) => {
    const response = await api.put(`/users/${cpf}`, userData);
    return response.data;
  },

  deleteUser: async (cpf: string) => {
    const response = await api.delete(`/users/${cpf}`);
    return response.data;
  },
};

export const salesService = {
  getAllSales: async () => {
    const response = await vehicleApi.get("/sales");
    return response.data;
  },

  createSale: async (saleData: {
    type: string;
    client: string;
    seller: string;
    vehicleId: number;
  }) => {
    const response = await vehicleApi.post("/sales", saleData);
    return response.data;
  },
};

export default api;
