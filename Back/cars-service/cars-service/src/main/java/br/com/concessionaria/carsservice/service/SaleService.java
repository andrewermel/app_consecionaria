package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Sale;
import br.com.concessionaria.carsservice.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pelas regras de negócio relacionadas às vendas.
 * Gerencia o registro de vendas efetivadas, aplicando lógica de negócio
 * para cálculo de preços, validações e geração de relatórios de vendas.
 */
@Service // Indica que esta classe é um componente de serviço do Spring
public class SaleService {
    
    // Injeta automaticamente o repositório de vendas
    @Autowired
    private SaleRepository saleRepository;

    /**
     * Retorna todas as vendas realizadas no sistema.
     * Usado para relatórios gerenciais e acompanhamento de performance.
     * 
     * @return Lista completa de vendas registradas
     */
    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    /**
     * Busca uma venda específica pelo seu identificador único.
     * Útil para consultar detalhes de uma venda específica.
     * 
     * @param id Identificador único da venda
     * @return Optional contendo a venda se encontrada, vazio caso contrário
     */
    public Optional<Sale> findById(Long id) {
        return saleRepository.findById(id);
    }

    /**
     * Registra uma nova venda ou atualiza uma existente.
     * Se a venda já existir (ID preenchido), será atualizada.
     * Se for uma nova venda (ID nulo), será registrada no histórico.
     * Aplica regras de negócio e validações antes de persistir.
     * 
     * @param sale Objeto venda a ser persistido
     * @return Venda salva com ID gerado (se nova) e campos atualizados
     */
    public Sale save(Sale sale) {
        return saleRepository.save(sale);
    }

    /**
     * Remove uma venda do sistema pelo seu identificador.
     * Deve ser usado com extremo cuidado, pois pode afetar relatórios
     * e auditorias. Geralmente vendas não devem ser deletadas.
     * 
     * @param id Identificador único da venda a ser removida
     */
    public void deleteById(Long id) {
        saleRepository.deleteById(id);
    }
}
