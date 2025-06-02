package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Sale;
import br.com.concessionaria.carsservice.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {
    @Autowired
    private SaleService saleService;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.findAll();
    }
}
