package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Cart;
import br.com.concessionaria.carsservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Service para regras de negócio relacionadas ao carrinho
@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    // Retorna todos os carrinhos
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    // Busca um carrinho por ID
    public Optional<Cart> findById(Long id) {
        return cartRepository.findById(id);
    }

    // Busca carrinho ativo de um cliente
    public Optional<Cart> findByClient(String client) {
        return cartRepository.findByClient(client);
    }

    // Salva ou atualiza um carrinho
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    // Remove um carrinho pelo ID
    public void deleteById(Long id) {
        cartRepository.deleteById(id);
    }
}
