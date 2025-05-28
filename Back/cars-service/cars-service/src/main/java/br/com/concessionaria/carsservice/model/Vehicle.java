package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// Entidade que representa um veículo disponível na concessionária
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Identificador único do veículo
    private Long id;
    // Ano de fabricação do veículo
    private Integer year;
    // Preço base do veículo
    private Double basePrice;
    // Cor do veículo
    private String color;
    // Modelo do veículo
    private String model;
    // Indica se o veículo está disponível para venda
    private Boolean available;
}
