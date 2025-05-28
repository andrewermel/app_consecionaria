package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Sale;
import br.com.concessionaria.carsservice.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Service para regras de negócio relacionadas a vendas
@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;

    // Retorna todas as vendas
    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    // Busca uma venda por ID
    public Optional<Sale> findById(Long id) {
        return saleRepository.findById(id);
    }

    // Salva ou atualiza uma venda
    public Sale save(Sale sale) {
        return saleRepository.save(sale);
    }

    // Remove uma venda pelo ID
    public void deleteById(Long id) {
        saleRepository.deleteById(id);
    }
}
