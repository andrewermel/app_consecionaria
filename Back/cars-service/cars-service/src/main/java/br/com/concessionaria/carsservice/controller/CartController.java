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
        Vehicle vehicle = vehicleOpt.get();
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
        Optional<Cart> cartOpt = cartService.findByClient(client);
        if (cartOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartOpt.get());
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

    // Efetiva a venda (checkout)
    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkout(@PathVariable Long id, @RequestParam String seller, @RequestParam String type, @RequestParam(defaultValue = "COMUM") String clientType) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        Cart cart = cartOpt.get();
        // Validação: tempo máximo de 5 minutos para checkout
        if (cart.getAddedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
            // Libera o veículo
            Vehicle v = cart.getVehicle();
            v.setAvailable(true);
            vehicleService.save(v);
            cartService.deleteById(id);
            return ResponseEntity.badRequest().body("Tempo de reserva expirado (5 minutos)");
        }
        // Calcula preço final
        double precoFinal = calcularPrecoFinal(cart.getVehicle(), clientType);
        // Cria venda (pode adicionar o campo precoFinal na entidade Sale se desejar)
        Sale sale = new Sale(null, type, cart.getClient(), seller, cart.getVehicle(), LocalDateTime.now());
        // Comentário: para salvar o preço final, adicione o campo na entidade Sale
        saleService.save(sale);
        cartService.deleteById(id);
        return ResponseEntity.ok("Venda realizada. Preço final: R$ " + precoFinal);
    }

    // Cancela o carrinho
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Optional<Cart> cartOpt = cartService.findById(id);
        if (cartOpt.isEmpty()) return ResponseEntity.notFound().build();
        Cart cart = cartOpt.get();
        Vehicle v = cart.getVehicle();
        v.setAvailable(true);
        vehicleService.save(v);
        cartService.deleteById(id);
        return ResponseEntity.ok("Carrinho cancelado e veículo liberado");
    }
}
