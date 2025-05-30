package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Cart;
import br.com.concessionaria.carsservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pelas regras de negócio relacionadas ao carrinho de compras.
 * Gerencia as operações de adicionar, buscar, atualizar e remover itens do carrinho,
 * aplicando validações e lógica de negócio específica da concessionária.
 */
@Service // Indica que esta classe é um componente de serviço do Spring
public class CartService {
    
    // Injeta automaticamente o repositório de carrinho
    @Autowired
    private CartRepository cartRepository;

    /**
     * Retorna todos os carrinhos cadastrados no sistema.
     * Usado principalmente para fins administrativos e relatórios.
     * 
     * @return Lista com todos os carrinhos existentes no banco de dados
     */
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    /**
     * Busca um carrinho específico pelo seu identificador único.
     * 
     * @param id Identificador único do carrinho
     * @return Optional contendo o carrinho se encontrado, vazio caso contrário
     */
    public Optional<Cart> findById(Long id) {
        return cartRepository.findById(id);
    }

    /**
     * Busca todos os itens do carrinho de um cliente específico.
     * Um cliente pode ter múltiplos itens em seu carrinho.
     * 
     * @param client Identificação do cliente (CPF, email ou nome)
     * @return Lista com todos os itens do carrinho do cliente
     */
    public List<Cart> findByClient(String client) {
        return cartRepository.findByClient(client);
    }
    
    /**
     * Busca um item específico do carrinho por cliente e veículo.
     * Usado para verificar se um veículo já está no carrinho do cliente.
     * 
     * @param client Identificação do cliente
     * @param vehicleId ID do veículo
     * @return Optional contendo o item se encontrado, vazio caso contrário
     */
    public Optional<Cart> findByClientAndVehicleId(String client, Long vehicleId) {
        return cartRepository.findByClientAndVehicleId(client, vehicleId);
    }

    /**
     * Salva ou atualiza um carrinho no banco de dados.
     * Se o carrinho já existir (ID preenchido), será atualizado.
     * Se for um novo carrinho (ID nulo), será criado.
     * 
     * @param cart Objeto carrinho a ser persistido
     * @return Carrinho salvo com ID gerado (se novo) e campos atualizados
     */
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    /**
     * Remove um carrinho do sistema pelo seu identificador.
     * Geralmente usado após finalização de compra ou cancelamento.
     * 
     * @param id Identificador único do carrinho a ser removido
     */
    public void deleteById(Long id) {
        cartRepository.deleteById(id);
    }
}
