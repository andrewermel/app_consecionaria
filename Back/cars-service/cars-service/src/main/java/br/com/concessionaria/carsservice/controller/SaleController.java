package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Sale;
import br.com.concessionaria.carsservice.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller para endpoints de vendas
@RestController
@RequestMapping("/sales")
public class SaleController {
    @Autowired
    private SaleService saleService;

    // Lista todas as vendas realizadas
    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.findAll();
    }
}
