package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

// Entidade que representa uma venda realizada na concessionária
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Identificador único da venda
    private Long id;
    // Tipo da venda: online ou física
    private String type;
    // Identificação do cliente (pode ser id ou nome)
    private String client;
    // Identificação do vendedor (pode ser id ou nome)
    private String seller;
    // Veículo vendido
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    // Data e hora da venda
    private LocalDateTime date;
}
