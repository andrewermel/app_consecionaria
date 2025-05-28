package br.com.concessionaria.carsservice.repository;

import br.com.concessionaria.carsservice.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositório para acesso aos dados de vendas
@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
}
