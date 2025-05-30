package br.com.concessionaria.carsservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Classe principal que inicializa o Spring Boot para o serviço de carros.
 * Habilita o agendamento de tarefas (@EnableScheduling) para permitir a execução
 * automática do serviço de expiração de carrinhos.
 */
@SpringBootApplication
@EnableScheduling // Habilita tarefas agendadas (@Scheduled)
public class CarsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CarsServiceApplication.class, args);
    }
}
