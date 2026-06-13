# API de Motoristas (Drivers) - v1

Base path: `/v1/drivers`

## POST /v1/drivers

Criar um novo motorista.

**Body (JSON):**

```json
{
  "name": "Carlos Silva",
  "mobile": "999999999",
  "document": "123456789",
  "is_active": true
}
```

**Campos:**
- `name` (string, obrigatório) - Nome do motorista
- `mobile` (string, opcional) - Número de telefone/celular
- `document` (string, opcional) - Número do documento (BI, carta de condução, etc.)
- `is_active` (boolean, opcional, default: true) - Status ativo/inativo

**Resposta:** 201 Created

```json
{
  "id": 1,
  "name": "Carlos Silva",
  "mobile": "999999999",
  "document": "123456789",
  "is_active": true,
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T10:00:00.000Z",
  "deletedAt": null
}
```

---

## GET /v1/drivers?page=1&limit=10

Listar motoristas paginados.

**Query params:**
- `page` (number, default 1) - Número da página
- `limit` (number, default 10, máximo 50) - Itens por página

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 1,
      "name": "Carlos Silva",
      "mobile": "999999999",
      "document": "123456789",
      "is_active": true,
      "createdAt": "2026-01-25T10:00:00.000Z",
      "updatedAt": "2026-01-25T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "João Pedro",
      "mobile": "888888888",
      "document": "987654321",
      "is_active": true,
      "createdAt": "2026-01-24T14:30:00.000Z",
      "updatedAt": "2026-01-24T14:30:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 25,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

---

## GET /v1/drivers/:id

Obter detalhes de um motorista específico por ID.

**Parâmetros de URL:**
- `id` (number) - ID do motorista

**Resposta:** 200 OK

```json
{
  "id": 1,
  "name": "Carlos Silva",
  "mobile": "999999999",
  "document": "123456789",
  "is_active": true,
  "createdBy": {
    "id": 5,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "updatedBy": {
    "id": 5,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T10:00:00.000Z",
  "deletedAt": null
}
```

**Resposta:** 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Motorista com ID 999 não encontrado",
  "error": "Not Found"
}
```

---

## PATCH /v1/drivers/:id

Atualizar parcialmente um motorista.

**Parâmetros de URL:**
- `id` (number) - ID do motorista

**Body (JSON):** Qualquer campo opcional

```json
{
  "name": "Carlos Silva Jr.",
  "mobile": "911111111",
  "is_active": false
}
```

**Resposta:** 200 OK

```json
{
  "id": 1,
  "name": "Carlos Silva Jr.",
  "mobile": "911111111",
  "document": "123456789",
  "is_active": false,
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T11:30:00.000Z",
  "deletedAt": null
}
```

---

## DELETE /v1/drivers/:id

Soft-delete de um motorista (marca `deletedAt`).

**Parâmetros de URL:**
- `id` (number) - ID do motorista

**Resposta:** 200 OK ou 204 No Content

**Nota:** O motorista não é removido do banco de dados, apenas marcado como deletado (`deletedAt` preenchido). Pode ser restaurado posteriormente.

---

## PATCH /v1/drivers/:id/restore

Restaurar um motorista previamente removido (soft-delete).

**Parâmetros de URL:**
- `id` (number) - ID do motorista

**Resposta:** 200 OK

```json
{
  "id": 1,
  "name": "Carlos Silva",
  "mobile": "999999999",
  "document": "123456789",
  "is_active": true,
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T11:30:00.000Z",
  "deletedAt": null
}
```

---

## Validações

### Ao criar (POST):
- `name`: **obrigatório**, string não vazia
- `mobile`: opcional, string
- `document`: opcional, string
- `is_active`: opcional, booleano (default: true)

### Ao atualizar (PATCH):
- Todos os campos são opcionais
- Mesmas validações dos campos correspondentes ao criar

---

## Observações

1. **Soft Delete:** Motoristas deletados permanecem no banco com `deletedAt` preenchido e não aparecem em listagens normais
2. **Auditoria:** Todos os registros incluem `createdBy`, `updatedBy`, `createdAt`, `updatedAt` para rastreabilidade
3. **Paginação:** A listagem é sempre paginada, com limite máximo de 50 itens por página
4. **Relacionamentos:** Motoristas podem ser referenciados em vendas de bilhetes (`ticket-sale` e `penalty-ticket-sale`)

---

## Códigos de Erro Comuns

- **400 Bad Request:** Dados de entrada inválidos (ex: name vazio)
- **404 Not Found:** Motorista não encontrado com o ID fornecido
- **500 Internal Server Error:** Erro no servidor

---

## Exemplos de Uso

### Criar motorista:
```bash
POST /v1/drivers
Content-Type: application/json

{
  "name": "Maria Santos",
  "mobile": "922222222",
  "document": "BI123456"
}
```

### Listar motoristas ativos (primeira página):
```bash
GET /v1/drivers?page=1&limit=20
```

### Atualizar telefone do motorista:
```bash
PATCH /v1/drivers/5
Content-Type: application/json

{
  "mobile": "933333333"
}
```

### Desativar motorista:
```bash
PATCH /v1/drivers/5
Content-Type: application/json

{
  "is_active": false
}
```

### Remover motorista (soft delete):
```bash
DELETE /v1/drivers/5
```

### Restaurar motorista:
```bash
PATCH /v1/drivers/5/restore
```

***
