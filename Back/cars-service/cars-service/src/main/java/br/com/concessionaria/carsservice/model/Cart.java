package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

// Entidade que representa o carrinho de compras de um cliente
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Identificador único do carrinho
    private Long id;
    @ManyToOne
    @JoinColumn(name = "vehicle_id") // Associação com o veículo
    private Vehicle vehicle;
    // Identificação do cliente (pode ser id ou nome)
    private String client;
    // Data e hora em que o veículo foi adicionado ao carrinho
    private LocalDateTime addedAt;
}
