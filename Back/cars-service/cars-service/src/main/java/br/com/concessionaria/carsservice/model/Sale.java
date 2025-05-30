package br.com.concessionaria.carsservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma venda/compra realizada na concessionária.
 * 
 * Esta classe modela as transações comerciais que ocorrem no sistema,
 * registrando informações sobre o cliente, vendedor, veículo e detalhes da venda.
 * 
 * @author Sistema de Concessionária
 * @version 1.0
 * @since 2025
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    
    /**
     * Identificador único da venda.
     * Gerado automaticamente pelo banco de dados usando estratégia de auto incremento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Tipo da transação realizada.
     * Pode ser "VENDA" para vendedores ou "COMPRA" para clientes.
     * Determina o contexto da operação no sistema.
     */
    private String type;
    
    /**
     * Identificação do cliente que realizou a compra.
     * Armazena informações de identificação do cliente (nome, ID, etc.).
     */
    private String client;
    
    /**
     * Identificação do vendedor responsável pela venda.
     * Registra qual vendedor conduziu a transação comercial.
     */
    private String seller;
    
    /**
     * Veículo que foi vendido/comprado na transação.
     * Relacionamento many-to-one com a entidade Vehicle,
     * pois um veículo pode aparecer em múltiplas vendas (histórico).
     */
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    /**
     * Data e hora exata em que a venda foi realizada.
     * Registra o timestamp completo da transação para auditoria e relatórios.
     */
    private LocalDateTime date;
}
