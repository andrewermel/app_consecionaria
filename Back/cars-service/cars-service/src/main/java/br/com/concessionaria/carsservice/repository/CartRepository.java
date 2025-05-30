package br.com.concessionaria.carsservice.repository;

import br.com.concessionaria.carsservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repositório para acesso aos dados de carrinho
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // Busca todos os itens do carrinho de um cliente
    List<Cart> findByClient(String client);
    
    // Busca um item específico do carrinho por cliente e veículo
    Optional<Cart> findByClientAndVehicleId(String client, Long vehicleId);
}
