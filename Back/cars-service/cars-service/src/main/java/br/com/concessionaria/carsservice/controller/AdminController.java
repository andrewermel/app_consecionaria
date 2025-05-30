package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.service.CartExpirationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável por operações administrativas da concessionária.
 * Fornece endpoints para manutenção do sistema, limpeza de dados e operações especiais.
 * Acesso restrito para funções administrativas.
 */
@RestController
@RequestMapping("/admin") // Define que todos os endpoints começam com /admin
public class AdminController {
    
    // Injeta automaticamente o serviço de expiração de carrinhos
    @Autowired
    private CartExpirationService cartExpirationService;
    
    /**
     * Executa limpeza manual de carrinhos expirados.
     * Endpoint: POST /admin/clean-expired-carts
     * Acesso: Público (pode ser restringido por segurança se necessário)
     * 
     * Útil para executar limpeza fora do horário automático agendado
     * ou para testes de funcionamento do sistema.
     * 
     * @return Resposta JSON com número de carrinhos limpos
     */
    @PostMapping("/clean-expired-carts")
    public ResponseEntity<String> cleanExpiredCarts() {
        try {
            // Executa limpeza manual dos carrinhos expirados
            int cleanedCount = cartExpirationService.cleanExpiredCartsManually();
            
            // Retorna resultado da operação
            String message = String.format("✅ Limpeza manual concluída com sucesso! %d carrinhos expirados foram removidos.", cleanedCount);
            
            System.out.println("🔧 " + message);
            
            return ResponseEntity.ok(message);
            
        } catch (Exception e) {
            // Log do erro e resposta de erro
            String errorMessage = "❌ Erro na limpeza manual de carrinhos: " + e.getMessage();
            System.err.println(errorMessage);
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }
    
    /**
     * Endpoint de status do sistema de limpeza automática.
     * Endpoint: GET /admin/cleanup-status
     * Acesso: Público
     * 
     * Fornece informações sobre o funcionamento do sistema de limpeza automática.
     * 
     * @return Resposta JSON com status do sistema
     */
    @GetMapping("/cleanup-status")
    public ResponseEntity<String> getCleanupStatus() {
        String status = "🔄 Sistema de limpeza automática ATIVO\n" +
                       "⏰ Frequência: A cada 60 segundos\n" +
                       "🕐 Tempo de expiração: 1 minuto após adição ao carrinho\n" +
                       "🚀 Para limpeza manual: POST /admin/clean-expired-carts";
                       
        return ResponseEntity.ok(status);
    }
}
