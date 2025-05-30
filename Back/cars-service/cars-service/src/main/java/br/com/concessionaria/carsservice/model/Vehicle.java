package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entidade que representa um veículo disponível na concessionária.
 * Armazena todas as informações necessárias sobre os carros disponíveis para venda,
 * incluindo características técnicas, preço e status de disponibilidade.
 */
@Entity // Indica que esta classe é uma entidade JPA (mapeada para uma tabela do banco)
@Data // Lombok: gera getters, setters, equals, hashCode e toString automaticamente
@NoArgsConstructor // Lombok: gera construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Lombok: gera construtor com todos os argumentos
public class Vehicle {
    
    /**
     * Identificador único do veículo no sistema.
     * Gerado automaticamente pelo banco de dados.
     */
    @Id // Define como chave primária da entidade
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento do ID
    private Long id;
    
    /**
     * Ano de fabricação do veículo.
     * Usado para identificar a idade e versão do modelo.
     */
    private Integer year;
    
    /**
     * Preço base do veículo em reais.
     * Valor de tabela antes de descontos ou negociações.
     */
    private Double basePrice;
    
    /**
     * Cor do veículo.
     * Característica visual importante para o cliente.
     */
    private String color;
    
    /**
     * Modelo do veículo (ex: "Civic", "Corolla", "Onix").
     * Identifica o tipo específico do carro.
     */
    private String model;
    
    /**
     * Indica se o veículo está disponível para venda.
     * false = já vendido ou reservado; true = disponível para compra.
     */
    private Boolean available;
}
