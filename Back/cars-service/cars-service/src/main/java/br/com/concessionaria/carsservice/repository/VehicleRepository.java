package br.com.concessionaria.carsservice.repository;

import br.com.concessionaria.carsservice.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositório para acesso aos dados de veículos
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    /**
     * Conta quantos veículos estão disponíveis para venda.
     */
    long countByAvailableTrue();
    
    /**
     * Conta quantos veículos foram vendidos.
     */
    long countByAvailableFalse();
}
