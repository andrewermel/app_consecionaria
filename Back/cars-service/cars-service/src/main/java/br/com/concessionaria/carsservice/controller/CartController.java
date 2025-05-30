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

// Controller para endpoints do carrinho
@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private SaleService saleService;

    // Adiciona veículo ao carrinho
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestParam Long vehicleId, @RequestParam String client) {
        Optional<Vehicle> vehicleOpt = vehicleService.findById(vehicleId);
        if (vehicleOpt.isEmpty() || !vehicleOpt.get().getAvailable()) {
            return ResponseEntity.badRequest().body("Veículo não disponível");
        }
        
        // Verifica se o veículo já está no carrinho do cliente
        Optional<Cart> existingCart = cartService.findByClientAndVehicleId(client, vehicleId);
        if (existingCart.isPresent()) {
            return ResponseEntity.badRequest().body("Veículo já está no carrinho");
        }
        
        Vehicle vehicle = vehicleOpt.get();
        // Marca o veículo como indisponível no carrinho
        vehicle.setAvailable(false);
        vehicleService.save(vehicle);
        
        Cart cart = new Cart(null, vehicle, client, LocalDateTime.now());
        return ResponseEntity.ok(cartService.save(cart));
    }

    // Busca carrinho por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCart(@PathVariable Long id) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartOpt.get());
    }

    // Busca carrinho ativo de um cliente
    @GetMapping("/active/{client}")
    public ResponseEntity<?> getActiveCart(@PathVariable String client) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }

    // Calcula o preço final do veículo conforme cor e tipo de cliente
    private double calcularPrecoFinal(Vehicle vehicle, String clientType) {
        double preco = vehicle.getBasePrice();
        // Exemplo de regra: desconto para cor branca
        if ("branco".equalsIgnoreCase(vehicle.getColor())) {
            preco *= 0.95; // 5% de desconto para cor branca
        }
        // Exemplo de regra: desconto para cliente VIP
        if ("VIP".equalsIgnoreCase(clientType)) {
            preco *= 0.90; // 10% de desconto para cliente VIP
        }
        return preco;
    }

    // Efetiva a venda de um item específico (checkout)
    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long id, @RequestParam String seller, @RequestParam String type, @RequestParam(defaultValue = "COMUM") String clientType) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        Cart cart = cartOpt.get();
        
        // Validação: tempo máximo de 5 minutos para checkout
        if (cart.getAddedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
            // Marca o veículo como disponível novamente quando expira
            Vehicle expiredVehicle = cart.getVehicle();
            expiredVehicle.setAvailable(true);
            vehicleService.save(expiredVehicle);
            
            cartService.deleteById(id);
            return ResponseEntity.badRequest().body("Tempo de reserva expirado (5 minutos)");
        }
        
        // Verifica se o veículo ainda está disponível
        Vehicle vehicle = cart.getVehicle();
        if (!vehicle.getAvailable()) {
            cartService.deleteById(id);
            return ResponseEntity.badRequest().body("Veículo não está mais disponível");
        }
        
        // Marca o veículo como vendido
        vehicle.setAvailable(false);
        vehicleService.save(vehicle);
        
        // Calcula preço final
        double precoFinal = calcularPrecoFinal(vehicle, clientType);
        
        // Cria venda
        Sale sale = new Sale(null, type, cart.getClient(), seller, vehicle, LocalDateTime.now());
        saleService.save(sale);
        cartService.deleteById(id);
        
        return ResponseEntity.ok("Venda realizada. Preço final: R$ " + precoFinal);
    }
    
    // Efetiva a venda de todo o carrinho do cliente
    @PostMapping("/checkout-all/{client}")
    public ResponseEntity<?> checkoutAll(@PathVariable String client, @RequestParam String seller, @RequestParam String type, @RequestParam(defaultValue = "COMUM") String clientType) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho vazio");
        }
        
        double totalFinal = 0;
        int vendidosComSucesso = 0;
        
        for (Cart cart : cartItems) {
            // Validação: tempo máximo de 5 minutos para checkout
            if (cart.getAddedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
                // Marca o veículo como disponível novamente quando expira
                Vehicle expiredVehicle = cart.getVehicle();
                expiredVehicle.setAvailable(true);
                vehicleService.save(expiredVehicle);
                
                cartService.deleteById(cart.getId());
                continue;
            }
            
            // Verifica se o veículo ainda está disponível
            Vehicle vehicle = cart.getVehicle();
            if (!vehicle.getAvailable()) {
                // Marca o veículo como disponível novamente se não está mais disponível
                vehicle.setAvailable(true);
                vehicleService.save(vehicle);
                
                cartService.deleteById(cart.getId());
                continue;
            }
            
            // Marca o veículo como vendido
            vehicle.setAvailable(false);
            vehicleService.save(vehicle);
            
            // Calcula preço final
            double precoFinal = calcularPrecoFinal(vehicle, clientType);
            totalFinal += precoFinal;
            
            // Cria venda
            Sale sale = new Sale(null, type, client, seller, vehicle, LocalDateTime.now());
            saleService.save(sale);
            cartService.deleteById(cart.getId());
            
            vendidosComSucesso++;
        }
        
        return ResponseEntity.ok("Venda realizada para " + vendidosComSucesso + " veículos. Total: R$ " + totalFinal);
    }

    // Cancela um item específico do carrinho
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Cart cart = cartOpt.get();
        // Marca o veículo como disponível novamente
        Vehicle vehicle = cart.getVehicle();
        vehicle.setAvailable(true);
        vehicleService.save(vehicle);
        
        cartService.deleteById(id);
        return ResponseEntity.ok("Item removido do carrinho");
    }
    
    // Limpa todo o carrinho do cliente
    @PostMapping("/clear/{client}")
    public ResponseEntity<?> clearCart(@PathVariable String client) {
        List<Cart> cartItems = cartService.findByClient(client);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho já está vazio");
        }
        
        for (Cart cart : cartItems) {
            // Marca o veículo como disponível novamente
            Vehicle vehicle = cart.getVehicle();
            vehicle.setAvailable(true);
            vehicleService.save(vehicle);
            
            cartService.deleteById(cart.getId());
        }
        
        return ResponseEntity.ok("Carrinho limpo com sucesso");
    }
}
