# API de Turnos (Shifts) - v1

Base path: `/v1/shifts`

## POST /v1/shifts

Criar um novo turno.

Body (JSON):

```json
{
  "name": "Manhã",
  "start_time": "06:00",
  "end_time": "12:00",
  "is_active": true
}
```

Resposta: 201 Created

---

## GET /v1/shifts?page=1&limit=10

Listar turnos paginados.

Query params:
- `page` (number) - página (default 1)
- `limit` (number) - itens por página (default 10, máximo 50)

Resposta (200):

```json
{
  "items": [
    {
      "id": 1,
      "name": "Manhã",
      "start_time": "06:00:00",
      "end_time": "12:00:00",
      "is_active": true,
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 1,
    "itemCount": 1,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## GET /v1/shifts/:id

Obter um turno por ID.

Resposta (200): objeto `Shift` ou 404 se não existir.

---

## PATCH /v1/shifts/:id

Atualizar parcialmente um turno.

Body (JSON) - qualquer campo opcional:

```json
{
  "name": "Tarde",
  "start_time": "13:00",
  "end_time": "18:00",
  "is_active": false
}
```

Resposta (200): objeto atualizado.

---

## DELETE /v1/shifts/:id

Soft-delete de um turno (marca `deletedAt`).

Resposta (200) ou 204.

---

## PATCH /v1/shifts/:id/restore

Restaurar um turno previamente removido.

Resposta (200): objeto restaurado.

---

### Observações
- `start_time` e `end_time` são armazenados como tipo `time` no banco; envie no formato `HH:MM` ou `HH:MM:SS`.
- Validações:
  - `name`: string obrigatória ao criar.
  - `start_time`, `end_time`: strings obrigatórias ao criar.
  - `is_active`: booleano opcional.

***
