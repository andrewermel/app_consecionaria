package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Cart;
import br.com.concessionaria.carsservice.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Serviço responsável por gerenciar a expiração automática de carrinhos.
 * Executa uma tarefa agendada que verifica carrinhos expirados e libera os veículos
 * automaticamente, garantindo que veículos não fiquem "presos" indefinidamente.
 */
@Service
public class CartExpirationService {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private VehicleService vehicleService;
    
    /**
     * Tarefa agendada que executa a cada 60 segundos (1 minuto).
     * Verifica todos os carrinhos que estão há mais de 1 minuto sem checkout
     * e libera automaticamente os veículos, removendo o carrinho.
     */
    @Scheduled(fixedRate = 60000) // Executa a cada 60 segundos
    public void checkExpiredCarts() {
        try {
            System.out.println("🔄 Iniciando verificação de carrinhos expirados...");
            
            LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
            List<Cart> allCarts = cartService.findAll();
            
            System.out.println("📊 Total de carrinhos ativos: " + allCarts.size());
            
            int expiredCount = 0;
            
            for (Cart cart : allCarts) {
                // Se o carrinho foi adicionado há mais de 1 minuto
                if (cart.getAddedAt().isBefore(oneMinuteAgo)) {
                    // Libera o veículo
                    Vehicle vehicle = cart.getVehicle();
                    vehicle.setAvailable(true);
                    vehicleService.save(vehicle);
                    
                    // Remove o carrinho expirado
                    cartService.deleteById(cart.getId());
                    
                    expiredCount++;
                    
                    System.out.println("🕐 Carrinho expirado removido: ID=" + cart.getId() + 
                                     ", Veículo=" + vehicle.getModel() + 
                                     ", Cliente=" + cart.getClient());
                }
            }
            
            if (expiredCount > 0) {
                System.out.println("✅ Limpeza automática concluída: " + expiredCount + " carrinhos expirados removidos");
            } else {
                System.out.println("✅ Nenhum carrinho expirado encontrado");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Erro na limpeza automática de carrinhos: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Método utilitário para verificar manualmente carrinhos expirados.
     * Pode ser chamado via endpoint para testes ou manutenção manual.
     * 
     * @return Número de carrinhos que foram limpos
     */
    public int cleanExpiredCartsManually() {
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        List<Cart> allCarts = cartService.findAll();
        
        int cleanedCount = 0;
        
        for (Cart cart : allCarts) {
            if (cart.getAddedAt().isBefore(oneMinuteAgo)) {
                Vehicle vehicle = cart.getVehicle();
                vehicle.setAvailable(true);
                vehicleService.save(vehicle);
                cartService.deleteById(cart.getId());
                cleanedCount++;
            }
        }
        
        return cleanedCount;
    }
}
