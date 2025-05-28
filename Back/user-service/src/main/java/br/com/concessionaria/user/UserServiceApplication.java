package br.com.concessionaria.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Classe principal responsável por iniciar a aplicação Spring Boot
@SpringBootApplication // Habilita a configuração automática do Spring Boot
public class UserServiceApplication {
    public static void main(String[] args) {
        // Método que inicia a aplicação Spring Boot
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
