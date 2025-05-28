package br.com.concessionaria.carsservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// Configuração CORS para permitir requisições do frontend
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite requisições de qualquer origem durante desenvolvimento
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Permite todas as origens específicas do frontend
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173", 
            "http://localhost:5175", 
            "http://127.0.0.1:5173", 
            "http://127.0.0.1:5175"
        ));
        
        // Permite todos os métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Permite todos os headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permite envio de cookies e headers de autenticação
        configuration.setAllowCredentials(true);
        
        // Expõe headers para o frontend
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        // Configura para todas as rotas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
