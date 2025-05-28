# cars-service

Microsserviço Java Spring Boot para gerenciar veículos, vendas e carrinho de uma concessionária.

## Entidades principais

- **Veículo**: id, ano, precoBase, cor, modelo, disponivel (boolean)
- **Venda**: id, tipo (online/física), cliente, vendedor, veículo, data
- **Carrinho**: id, veículo, cliente, dataHoraAdicionado

## Como rodar

1. Configure o banco de dados PostgreSQL no `application.properties`.
2. Execute: `mvn spring-boot:run`

## Dependências

- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- Spring Boot DevTools

---

Este serviço NÃO implementa autenticação própria. Use o JWT gerado pelo user-service para proteger endpoints futuramente.
