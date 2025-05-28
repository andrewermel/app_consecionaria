import { Box, Typography } from "@mui/material";

const TestComponent = () => {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" component="h1">
        Teste de Renderização
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Se você está vendo esta mensagem, o React e o Material-UI estão
        funcionando!
      </Typography>
    </Box>
  );
};

export default TestComponent;
