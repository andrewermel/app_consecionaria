package br.com.concessionaria.carsservice.controller;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller responsável pelo gerenciamento de veículos da concessionária.
 * Fornece endpoints para operações CRUD (Create, Read, Update, Delete) de veículos.
 * Todos os endpoints são acessíveis publicamente para visualização de estoque.
 */
@RestController
@RequestMapping("/vehicles") // Define que todos os endpoints começam com /vehicles
public class VehicleController {
    
    // Injeta automaticamente o serviço de veículos
    @Autowired
    private VehicleService vehicleService;

    /**
     * Lista todos os veículos disponíveis para venda.
     * Endpoint: GET /vehicles
     * Acesso: Público
     * 
     * @return Lista de veículos disponíveis (available = true)
     */
    @GetMapping
    public List<Vehicle> getAllAvailable() {
        // Busca todos os veículos do banco de dados
        List<Vehicle> vehicles = vehicleService.findAll();
        
        // Se a lista for null, retorna uma lista vazia para evitar erros
        if (vehicles == null) {
            return List.of();
        }
        
        // Filtra apenas os veículos disponíveis para venda
        return vehicles.stream()
                .filter(vehicle -> vehicle != null && // Veículo não pode ser null
                         vehicle.getAvailable() != null && // Campo available não pode ser null
                         vehicle.getAvailable()) // Deve estar disponível (true)
                .toList();
    }

    /**
     * Busca os detalhes de um veículo específico pelo ID.
     * Endpoint: GET /vehicles/{id}
     * Acesso: Público
     * 
     * @param id ID do veículo a ser buscado
     * @return Dados do veículo encontrado ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        // Busca o veículo pelo ID no banco de dados
        Optional<Vehicle> vehicle = vehicleService.findById(id);
        
        // Se encontrou, retorna os dados; senão retorna 404 Not Found
        return vehicle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Cria um novo veículo no estoque.
     * Endpoint: POST /vehicles
     * Acesso: Público
     * 
     * @param vehicle Dados do veículo a ser criado
     * @return Dados do veículo criado com ID gerado
     */
    @PostMapping
    public Vehicle create(@RequestBody Vehicle vehicle) {
        // Salva o novo veículo no banco de dados
        return vehicleService.save(vehicle);
    }

    /**
     * Atualiza os dados de um veículo existente.
     * Endpoint: PUT /vehicles/{id}
     * Acesso: Público
     * 
     * @param id ID do veículo a ser atualizado
     * @param vehicle Novos dados do veículo
     * @return Dados do veículo atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        // Verifica se o veículo existe no banco de dados
        Optional<Vehicle> existingVehicle = vehicleService.findById(id);
        if (existingVehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Define o ID do veículo para garantir que será uma atualização (não criação)
        vehicle.setId(id);
        
        // Salva as alterações no banco de dados
        Vehicle updatedVehicle = vehicleService.save(vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    /**
     * Remove um veículo do estoque.
     * Endpoint: DELETE /vehicles/{id}
     * Acesso: Público
     * 
     * @param id ID do veículo a ser removido
     * @return Resposta vazia com status 204 (No Content) ou 404 se não encontrado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Verifica se o veículo existe antes de tentar remover
        Optional<Vehicle> existingVehicle = vehicleService.findById(id);
        if (existingVehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Remove o veículo do banco de dados
        vehicleService.deleteById(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (No Content)
    }
}
