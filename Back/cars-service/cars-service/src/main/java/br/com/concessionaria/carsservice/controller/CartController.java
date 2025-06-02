package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Cart;
import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.model.Sale;
import br.com.concessionaria.carsservice.service.CartService;
import br.com.concessionaria.carsservice.service.VehicleService;
import br.com.concessionaria.carsservice.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private SaleService saleService;

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestParam Long vehicleId, @RequestParam String client) {
        Optional<Vehicle> vehicleOpt = vehicleService.findById(vehicleId);
        if (vehicleOpt.isEmpty() || !vehicleOpt.get().getAvailable()) {
            return ResponseEntity.badRequest().body("Veículo não disponível");
        }
        
        Optional<Cart> existingCart = cartService.findByClientAndVehicleId(client, vehicleId);
        if (existingCart.isPresent()) {
            return ResponseEntity.badRequest().body("Veículo já está no carrinho");
        }
        
        Vehicle vehicle = vehicleOpt.get();
        vehicle.setAvailable(false);
        vehicleService.save(vehicle);
        
        Cart cart = new Cart(null, vehicle, client, LocalDateTime.now());
        return ResponseEntity.ok(cartService.save(cart));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCart(@PathVariable Long id) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartOpt.get());
    }

    @GetMapping("/active/{client}")
    public ResponseEntity<?> getActiveCart(@PathVariable String client) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }

    private double calcularPrecoFinal(Vehicle vehicle, String clientType) {
        double preco = vehicle.getBasePrice();
        if ("branco".equalsIgnoreCase(vehicle.getColor())) {
            preco *= 0.95;
        }
        if ("VIP".equalsIgnoreCase(clientType)) {
            preco *= 0.90;
        }
        return preco;
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long id, @RequestParam String seller, @RequestParam String type, @RequestParam(defaultValue = "COMUM") String clientType) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        Cart cart = cartOpt.get();
        
        if (cart.getAddedAt().plusMinutes(1).isBefore(LocalDateTime.now())) {
            Vehicle expiredVehicle = cart.getVehicle();
            expiredVehicle.setAvailable(true);
            vehicleService.save(expiredVehicle);
            
            cartService.deleteById(id);
            return ResponseEntity.badRequest().body("Tempo de reserva expirado (1 minuto)");
        }
        
        Vehicle vehicle = cart.getVehicle();
        
        vehicle.setAvailable(false);
        vehicleService.save(vehicle);
        
        double precoFinal = calcularPrecoFinal(vehicle, clientType);
        
        Sale sale = new Sale(null, type, cart.getClient(), seller, vehicle, LocalDateTime.now());
        saleService.save(sale);
        cartService.deleteById(id);
        
        return ResponseEntity.ok("Venda realizada. Preço final: R$ " + precoFinal);
    }
    
    @PostMapping("/checkout-all/{client}")
    public ResponseEntity<?> checkoutAll(@PathVariable String client, @RequestParam String seller, @RequestParam String type, @RequestParam(defaultValue = "COMUM") String clientType) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho vazio");
        }
        
        double totalFinal = 0;
        int vendidosComSucesso = 0;
        
        for (Cart cart : cartItems) {
            if (cart.getAddedAt().plusMinutes(1).isBefore(LocalDateTime.now())) {
                Vehicle expiredVehicle = cart.getVehicle();
                expiredVehicle.setAvailable(true);
                vehicleService.save(expiredVehicle);
                
                cartService.deleteById(cart.getId());
                continue;
            }
            
            Vehicle vehicle = cart.getVehicle();
            
            vehicle.setAvailable(false);
            vehicleService.save(vehicle);
            
            double precoFinal = calcularPrecoFinal(vehicle, clientType);
            totalFinal += precoFinal;
            
            Sale sale = new Sale(null, type, client, seller, vehicle, LocalDateTime.now());
            saleService.save(sale);
            cartService.deleteById(cart.getId());
            
            vendidosComSucesso++;
        }
        
        return ResponseEntity.ok("Venda realizada para " + vendidosComSucesso + " veículos. Total: R$ " + totalFinal);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Cart cart = cartOpt.get();
        Vehicle vehicle = cart.getVehicle();
        vehicle.setAvailable(true);
        vehicleService.save(vehicle);
        
        cartService.deleteById(id);
        return ResponseEntity.ok("Item removido do carrinho");
    }
    
    @PostMapping("/clear/{client}")
    public ResponseEntity<?> clearCart(@PathVariable String client) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho já está vazio");
        }
        
        for (Cart cart : cartItems) {
            Vehicle vehicle = cart.getVehicle();
            vehicle.setAvailable(true);
            vehicleService.save(vehicle);
            
            cartService.deleteById(cart.getId());
        }
        
        return ResponseEntity.ok("Carrinho limpo com sucesso");
    }
}
