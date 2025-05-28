package br.com.concessionaria.carsservice.repository;

import br.com.concessionaria.carsservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repositório para acesso aos dados de carrinho
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // Busca carrinho ativo por cliente
    Optional<Cart> findByClient(String client);
}
