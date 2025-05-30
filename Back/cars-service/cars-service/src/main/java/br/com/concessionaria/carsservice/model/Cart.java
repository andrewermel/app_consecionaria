package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidade que representa o carrinho de compras de um cliente.
 * Armazena temporariamente os veículos que o cliente tem interesse em comprar
 * antes de finalizar a venda. Funciona como uma lista de desejos ou carrinho
 * de compras tradicional de e-commerce.
 */
@Entity // Indica que esta classe é uma entidade JPA (mapeada para uma tabela do banco)
@Data // Lombok: gera getters, setters, equals, hashCode e toString automaticamente
@NoArgsConstructor // Lombok: gera construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Lombok: gera construtor com todos os argumentos
public class Cart {
    
    /**
     * Identificador único do item no carrinho.
     * Gerado automaticamente pelo banco de dados.
     */
    @Id // Define como chave primária da entidade
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento do ID
    private Long id;
    
    /**
     * Veículo adicionado ao carrinho.
     * Relacionamento muitos-para-um: um veículo pode estar em vários carrinhos,
     * mas cada item do carrinho se refere a apenas um veículo.
     */
    @ManyToOne // Define relacionamento muitos-para-um com Vehicle
    @JoinColumn(name = "vehicle_id") // Nome da coluna de chave estrangeira no banco
    private Vehicle vehicle;
    
    /**
     * Identificação do cliente que adicionou o veículo ao carrinho.
     * Pode ser o CPF, email ou nome do cliente.
     */
    private String client;
    
    /**
     * Data e hora em que o veículo foi adicionado ao carrinho.
     * Usado para controlar quando o interesse foi manifestado e
     * para limpar carrinhos antigos se necessário.
     */
    private LocalDateTime addedAt;
}
