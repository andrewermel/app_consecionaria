package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.service.CartExpirationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private CartExpirationService cartExpirationService;
    
    @PostMapping("/clean-expired-carts")
    public ResponseEntity<String> cleanExpiredCarts() {
        try {
            int cleanedCount = cartExpirationService.cleanExpiredCartsManually();
            
            String message = String.format("✅ Limpeza manual concluída com sucesso! %d carrinhos expirados foram removidos.", cleanedCount);
            
            System.out.println("🔧 " + message);
            
            return ResponseEntity.ok(message);
            
        } catch (Exception e) {
            String errorMessage = "❌ Erro na limpeza manual de carrinhos: " + e.getMessage();
            System.err.println(errorMessage);
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }
    
    @GetMapping("/cleanup-status")
    public ResponseEntity<String> getCleanupStatus() {
        String status = "🔄 Sistema de limpeza automática ATIVO\n" +
                       "⏰ Frequência: A cada 60 segundos\n" +
                       "🕐 Tempo de expiração: 1 minuto após adição ao carrinho\n" +
                       "🚀 Para limpeza manual: POST /admin/clean-expired-carts";
                       
        return ResponseEntity.ok(status);
    }
}
