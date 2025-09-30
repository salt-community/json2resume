---
apply: always
instructions: Apply this when working in the backend (backend folder)
---

# Backend Rules

## Principles
- Follow SOLID principles
- Spring RestController should only receive and return DTOs
- DTOs should be records and have toDomainObject if it matches a Domain Object

## Directory Structure
- Group by layer, not by feature

### Example Structure:
- backend
  - config
  - controller
  - dto
    - request
    - response
  - exception
  - model
  - repository
  - service
  - BackendApplication.java