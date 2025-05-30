package br.com.concessionaria.carsservice.service;

import br.com.concessionaria.carsservice.model.Vehicle;
import br.com.concessionaria.carsservice.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pelas regras de negócio relacionadas aos veículos.
 * Centraliza toda a lógica de manipulação de veículos, incluindo validações,
 * controle de disponibilidade e operações CRUD com regras específicas da concessionária.
 */
@Service // Indica que esta classe é um componente de serviço do Spring
public class VehicleService {
    
    // Injeta automaticamente o repositório de veículos
    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Retorna todos os veículos cadastrados no sistema.
     * Inclui tanto veículos disponíveis quanto já vendidos.
     * 
     * @return Lista completa de veículos no estoque
     */
    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    /**
     * Busca um veículo específico pelo seu identificador único.
     * 
     * @param id Identificador único do veículo
     * @return Optional contendo o veículo se encontrado, vazio caso contrário
     */
    public Optional<Vehicle> findById(Long id) {
        return vehicleRepository.findById(id);
    }

    /**
     * Salva ou atualiza um veículo no banco de dados.
     * Se o veículo já existir (ID preenchido), será atualizado.
     * Se for um novo veículo (ID nulo), será criado no estoque.
     * Aplica validações de negócio antes de persistir.
     * 
     * @param vehicle Objeto veículo a ser persistido
     * @return Veículo salvo com ID gerado (se novo) e campos atualizados
     */
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    /**
     * Remove um veículo do sistema pelo seu identificador.
     * Deve ser usado com cuidado, pois remove permanentemente o registro.
     * Alternativa recomendada: marcar como indisponível em vez de deletar.
     * 
     * @param id Identificador único do veículo a ser removido
     */
    public void deleteById(Long id) {
        vehicleRepository.deleteById(id);
    }
}
