# API de Passes (Passe de Transporte) - v1

Base paths:

- Destinos: `/v1/pass-destinations`
- Categorias: `/v1/pass-categories`
- Tarifas: `/v1/pass-tariffs`
- Passes e pagamentos: `/v1/passes`
- Relatórios: `/v1/pass-reports`

Prefixo global da API: `/api/v1` (documentado abaixo como `/v1/...`).

## Autenticação

Todos os endpoints requerem JWT Bearer Token:

```
Authorization: Bearer <token>
```

**Roles (resumo):**

| Operação | Roles típicas |
|---|---|
| Criar / actualizar catálogo (destino, categoria, tarifa) | `ADMIN`, `GESTOR`, `COORDENADOR` |
| Soft-delete (DELETE) | `ADMIN` |
| Criar passe, renovar, registar pagamento | `ADMIN`, `GESTOR`, `COORDENADOR`, `CAIXA` |
| Alterar status do passe | `ADMIN`, `GESTOR`, `COORDENADOR` |
| Listar / consultar | `ADMIN`, `GESTOR`, `COORDENADOR`, `CAIXA`, `OPERATOR`, `SUPERVISOR` |
| Relatórios | `ADMIN`, `GESTOR`, `COORDENADOR`, `SUPERVISOR` |

---

# 1. Destinos — `/v1/pass-destinations`

## POST /v1/pass-destinations

Criar um novo destino (ex.: Maputo, Matola).

**Body (JSON):**

```json
{
  "name": "Maputo",
  "description": "Cidade de Maputo — zona metropolitana",
  "status": "ACTIVE"
}
```

**Campos:**
- `name` (string, obrigatório, máx. 150) - Nome do destino (único)
- `description` (string, opcional) - Descrição
- `status` (enum `EntityStatus`, opcional, default: `ACTIVE`) - `ACTIVE` \| `INACTIVE`

**Resposta:** 201 Created

```json
{
  "id": 1,
  "name": "Maputo",
  "description": "Cidade de Maputo — zona metropolitana",
  "status": "ACTIVE",
  "createdAt": "2026-07-23T10:00:00.000Z",
  "updatedAt": "2026-07-23T10:00:00.000Z",
  "deletedAt": null
}
```

---

## GET /v1/pass-destinations?page=1&limit=10

Listar destinos paginados.

**Query params:**
- `page` (number, default 1) - Número da página
- `limit` (number, default 50) - Itens por página
- `search` (string, opcional) - Pesquisa em `name` e `description`
- `status` (enum `EntityStatus`, opcional) - Filtrar por status

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 1,
      "name": "Maputo",
      "description": "Cidade de Maputo — zona metropolitana",
      "status": "ACTIVE",
      "createdAt": "2026-07-23T10:00:00.000Z",
      "updatedAt": "2026-07-23T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Matola",
      "description": "Município da Matola",
      "status": "ACTIVE",
      "createdAt": "2026-07-22T09:00:00.000Z",
      "updatedAt": "2026-07-22T09:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 2,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## GET /v1/pass-destinations/:id

Obter detalhes de um destino (inclui categorias).

**Parâmetros de URL:**
- `id` (number) - ID do destino

**Resposta:** 200 OK

```json
{
  "id": 1,
  "name": "Maputo",
  "description": "Cidade de Maputo — zona metropolitana",
  "status": "ACTIVE",
  "categories": [
    {
      "id": 1,
      "name": "STUDENT",
      "status": "ACTIVE",
      "destinationId": 1
    },
    {
      "id": 2,
      "name": "WORKER",
      "status": "ACTIVE",
      "destinationId": 1
    }
  ],
  "createdBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "updatedBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:00:00.000Z",
  "updatedAt": "2026-07-23T10:00:00.000Z",
  "deletedAt": null
}
```

**Resposta:** 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Destination with id 999 not found",
  "error": "Not Found"
}
```

---

## PATCH /v1/pass-destinations/:id

Actualizar parcialmente um destino.

**Parâmetros de URL:**
- `id` (number) - ID do destino

**Body (JSON):** Qualquer campo opcional

```json
{
  "name": "Maputo Cidade",
  "description": "Capital de Moçambique",
  "status": "INACTIVE"
}
```

**Resposta:** 200 OK

```json
{
  "id": 1,
  "name": "Maputo Cidade",
  "description": "Capital de Moçambique",
  "status": "INACTIVE",
  "createdAt": "2026-07-23T10:00:00.000Z",
  "updatedAt": "2026-07-23T11:30:00.000Z",
  "deletedAt": null
}
```

---

## DELETE /v1/pass-destinations/:id

Soft-delete de um destino (marca `deletedAt`).

**Parâmetros de URL:**
- `id` (number) - ID do destino

**Resposta:** 200 OK

```json
{
  "message": "Destination deleted successfully"
}
```

---

# 2. Categorias — `/v1/pass-categories`

## POST /v1/pass-categories

Criar uma categoria associada a um destino (ex.: STUDENT, WORKER).

**Body (JSON):**

```json
{
  "destinationId": 1,
  "name": "STUDENT",
  "status": "ACTIVE"
}
```

**Campos:**
- `destinationId` (number, obrigatório) - ID do destino
- `name` (string, obrigatório, máx. 100) - Nome da categoria (único por destino)
- `status` (enum `EntityStatus`, opcional, default: `ACTIVE`)

**Resposta:** 201 Created

```json
{
  "id": 1,
  "destinationId": 1,
  "name": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2026-07-23T10:05:00.000Z",
  "updatedAt": "2026-07-23T10:05:00.000Z",
  "deletedAt": null
}
```

---

## GET /v1/pass-categories?page=1&limit=10

Listar categorias paginadas.

**Query params:**
- `page` (number, default 1)
- `limit` (number, default 50)
- `destinationId` (number, opcional) - Filtrar por destino
- `search` (string, opcional) - Pesquisa pelo nome
- `status` (enum `EntityStatus`, opcional)

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 1,
      "destinationId": 1,
      "name": "STUDENT",
      "status": "ACTIVE",
      "destination": {
        "id": 1,
        "name": "Maputo",
        "status": "ACTIVE"
      },
      "createdAt": "2026-07-23T10:05:00.000Z",
      "updatedAt": "2026-07-23T10:05:00.000Z"
    },
    {
      "id": 2,
      "destinationId": 1,
      "name": "WORKER",
      "status": "ACTIVE",
      "destination": {
        "id": 1,
        "name": "Maputo",
        "status": "ACTIVE"
      },
      "createdAt": "2026-07-23T10:06:00.000Z",
      "updatedAt": "2026-07-23T10:06:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 2,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## GET /v1/pass-categories/:id

Obter detalhes de uma categoria (inclui `destination` e `tariffs`).

**Parâmetros de URL:**
- `id` (number) - ID da categoria

**Resposta:** 200 OK

```json
{
  "id": 1,
  "destinationId": 1,
  "name": "STUDENT",
  "status": "ACTIVE",
  "destination": {
    "id": 1,
    "name": "Maputo",
    "description": "Cidade de Maputo — zona metropolitana",
    "status": "ACTIVE"
  },
  "tariffs": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Estudante Normal 2026",
      "tariffType": "NORMAL",
      "monthlyAmount": "850.00",
      "registrationFee": "200.00",
      "status": "ACTIVE",
      "effectiveFrom": "2026-01-01",
      "effectiveTo": null
    }
  ],
  "createdBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "updatedBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:05:00.000Z",
  "updatedAt": "2026-07-23T10:05:00.000Z",
  "deletedAt": null
}
```

---

## PATCH /v1/pass-categories/:id

Actualizar parcialmente uma categoria (`name`, `status`). O `destinationId` não pode ser alterado.

**Parâmetros de URL:**
- `id` (number) - ID da categoria

**Body (JSON):**

```json
{
  "name": "STUDENT",
  "status": "INACTIVE"
}
```

**Resposta:** 200 OK

```json
{
  "id": 1,
  "destinationId": 1,
  "name": "STUDENT",
  "status": "INACTIVE",
  "destination": {
    "id": 1,
    "name": "Maputo",
    "status": "ACTIVE"
  },
  "tariffs": [],
  "createdAt": "2026-07-23T10:05:00.000Z",
  "updatedAt": "2026-07-23T12:00:00.000Z",
  "deletedAt": null
}
```

---

## DELETE /v1/pass-categories/:id

Soft-delete de uma categoria.

**Parâmetros de URL:**
- `id` (number) - ID da categoria

**Resposta:** 200 OK

```json
{
  "message": "Category deleted successfully"
}
```

---

# 3. Tarifas — `/v1/pass-tariffs`

## POST /v1/pass-tariffs

Criar uma tarifa associada a uma categoria.

**Body (JSON):**

```json
{
  "categoryId": 1,
  "name": "Estudante Normal 2026",
  "tariffType": "NORMAL",
  "monthlyAmount": 850.0,
  "registrationFee": 200.0,
  "status": "ACTIVE",
  "effectiveFrom": "2026-01-01",
  "effectiveTo": null
}
```

**Campos:**
- `categoryId` (number, obrigatório) - ID da categoria
- `name` (string, obrigatório, máx. 150) - Nome da tarifa
- `tariffType` (enum `TariffType`, obrigatório) - `NORMAL` \| `SPECIAL`
- `monthlyAmount` (number, obrigatório, ≥ 0) - Valor mensal em MZN
- `registrationFee` (number, obrigatório, ≥ 0) - Taxa de inscrição em MZN
- `status` (enum `EntityStatus`, opcional, default: `ACTIVE`)
- `effectiveFrom` (date string ISO, obrigatório) - Início de vigência (`YYYY-MM-DD`)
- `effectiveTo` (date string ISO, opcional) - Fim de vigência (`YYYY-MM-DD`)

**Resposta:** 201 Created

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "Estudante Normal 2026",
  "tariffType": "NORMAL",
  "monthlyAmount": "850.00",
  "registrationFee": "200.00",
  "status": "ACTIVE",
  "effectiveFrom": "2026-01-01",
  "effectiveTo": null,
  "createdAt": "2026-07-23T10:10:00.000Z",
  "updatedAt": "2026-07-23T10:10:00.000Z",
  "deletedAt": null
}
```

---

## GET /v1/pass-tariffs?page=1&limit=10

Listar tarifas paginadas.

**Query params:**
- `page` (number, default 1)
- `limit` (number, default 50)
- `categoryId` (number, opcional)
- `tariffType` (enum `TariffType`, opcional) - `NORMAL` \| `SPECIAL`
- `status` (enum `EntityStatus`, opcional)
- `search` (string, opcional) - Pesquisa pelo nome

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Estudante Normal 2026",
      "tariffType": "NORMAL",
      "monthlyAmount": "850.00",
      "registrationFee": "200.00",
      "status": "ACTIVE",
      "effectiveFrom": "2026-01-01",
      "effectiveTo": null,
      "category": {
        "id": 1,
        "name": "STUDENT",
        "destinationId": 1
      },
      "createdAt": "2026-07-23T10:10:00.000Z",
      "updatedAt": "2026-07-23T10:10:00.000Z"
    },
    {
      "id": 2,
      "categoryId": 2,
      "name": "Trabalhador Especial Matola",
      "tariffType": "SPECIAL",
      "monthlyAmount": "1200.00",
      "registrationFee": "250.00",
      "status": "ACTIVE",
      "effectiveFrom": "2026-01-01",
      "effectiveTo": "2026-12-31",
      "category": {
        "id": 2,
        "name": "WORKER",
        "destinationId": 2
      },
      "createdAt": "2026-07-23T10:12:00.000Z",
      "updatedAt": "2026-07-23T10:12:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 2,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## GET /v1/pass-tariffs/:id

Obter detalhes de uma tarifa (inclui `category` e `category.destination`).

**Parâmetros de URL:**
- `id` (number) - ID da tarifa

**Resposta:** 200 OK

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "Estudante Normal 2026",
  "tariffType": "NORMAL",
  "monthlyAmount": "850.00",
  "registrationFee": "200.00",
  "status": "ACTIVE",
  "effectiveFrom": "2026-01-01",
  "effectiveTo": null,
  "category": {
    "id": 1,
    "name": "STUDENT",
    "status": "ACTIVE",
    "destinationId": 1,
    "destination": {
      "id": 1,
      "name": "Maputo",
      "status": "ACTIVE"
    }
  },
  "createdBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "updatedBy": {
    "id": 5,
    "name": "Ana Mucavele",
    "email": "ana.mucavele@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:10:00.000Z",
  "updatedAt": "2026-07-23T10:10:00.000Z",
  "deletedAt": null
}
```

---

## PATCH /v1/pass-tariffs/:id

Actualizar parcialmente uma tarifa. O `categoryId` não pode ser alterado.

**Parâmetros de URL:**
- `id` (number) - ID da tarifa

**Body (JSON):**

```json
{
  "monthlyAmount": 900.0,
  "registrationFee": 220.0,
  "status": "ACTIVE",
  "effectiveTo": "2026-12-31"
}
```

**Resposta:** 200 OK

```json
{
  "id": 1,
  "categoryId": 1,
  "name": "Estudante Normal 2026",
  "tariffType": "NORMAL",
  "monthlyAmount": "900.00",
  "registrationFee": "220.00",
  "status": "ACTIVE",
  "effectiveFrom": "2026-01-01",
  "effectiveTo": "2026-12-31",
  "createdAt": "2026-07-23T10:10:00.000Z",
  "updatedAt": "2026-07-23T14:00:00.000Z",
  "deletedAt": null
}
```

---

## DELETE /v1/pass-tariffs/:id

Soft-delete de uma tarifa.

**Parâmetros de URL:**
- `id` (number) - ID da tarifa

**Resposta:** 200 OK

```json
{
  "message": "Tariff deleted successfully"
}
```

---

# 4. Passes — `/v1/passes`

## POST /v1/passes

Criar um novo passe. O número do cartão (`cardNumber`) é gerado automaticamente por ano no formato `00001`, `00002`, … (único por `cardYear`).

Por defeito (`registerPayment !== false`), é criado um pagamento de inscrição (`REGISTRATION`) que inclui taxa de inscrição + valor mensal, com recibo no formato `PASS-YYYYMM-0001` (ex.: `PASS-202607-0001`).

**Body (JSON):**

```json
{
  "fullName": "Maria João Mabunda",
  "identityNumber": "110101234567A",
  "destinationId": 1,
  "categoryId": 1,
  "tariffId": 1,
  "bairro": "Polana Cimento",
  "rua": "Av. Julius Nyerere",
  "quarteirao": "12",
  "casaNumero": "45",
  "andar": "2",
  "unidade": "B",
  "employerName": null,
  "schoolName": "Escola Secundária Francisco Manyanga",
  "schoolClass": "12ª A",
  "schoolNumber": "2341",
  "schoolGrade": "12",
  "bairroConfirmation": true,
  "employerConfirmation": false,
  "schoolConfirmation": true,
  "photo": "https://cdn.tmb.co.mz/passes/maria-mabunda.jpg",
  "status": "ACTIVE",
  "issueDate": "2026-07-23",
  "notes": "Primeira emissão — estudante",
  "registerPayment": true,
  "discount": 50.0,
  "referenceMonth": "JULY",
  "referenceYear": 2026
}
```

**Campos:**
- `fullName` (string, obrigatório, máx. 200) - Nome completo do titular
- `identityNumber` (string, obrigatório, máx. 50) - Número do BI / documento de identidade
- `destinationId` (number, obrigatório) - Destino
- `categoryId` (number, obrigatório) - Categoria (deve pertencer ao destino)
- `tariffId` (number, obrigatório) - Tarifa (deve pertencer à categoria)
- `bairro` (string, opcional) - Bairro
- `rua` (string, opcional) - Rua / avenida
- `quarteirao` (string, opcional) - Quarteirão
- `casaNumero` (string, opcional) - Número da casa
- `andar` (string, opcional) - Andar
- `unidade` (string, opcional) - Unidade / porta
- `employerName` (string, opcional) - Nome do empregador (WORKER)
- `schoolName` (string, opcional) - Nome da escola (STUDENT)
- `schoolClass` (string, opcional) - Turma
- `schoolNumber` (string, opcional) - Número de estudante
- `schoolGrade` (string, opcional) - Classe / grau
- `bairroConfirmation` (boolean, opcional, default: false)
- `employerConfirmation` (boolean, opcional, default: false)
- `schoolConfirmation` (boolean, opcional, default: false)
- `photo` (string, opcional) - URL ou referência da foto
- `status` (enum `PassStatus`, opcional, default: `ACTIVE`)
- `issueDate` (date string ISO, opcional) - Data de emissão (`YYYY-MM-DD`); default: hoje
- `notes` (string, opcional) - Observações
- `registerPayment` (boolean, opcional, default: `true`) - Se `true`, cria pagamento `REGISTRATION`
- `discount` (number, opcional, ≥ 0) - Desconto em MZN aplicado ao pagamento inicial
- `referenceMonth` (enum `ReferenceMonth`, opcional) - Mês de referência do pagamento; default: mês actual
- `referenceYear` (number, opcional, ≥ 2000) - Ano de referência; default: ano actual

**Resposta:** 201 Created (passe com relações e pagamentos)

```json
{
  "id": 1,
  "cardNumber": "00001",
  "cardYear": 2026,
  "fullName": "Maria João Mabunda",
  "identityNumber": "110101234567A",
  "destinationId": 1,
  "categoryId": 1,
  "tariffId": 1,
  "bairro": "Polana Cimento",
  "rua": "Av. Julius Nyerere",
  "quarteirao": "12",
  "casaNumero": "45",
  "andar": "2",
  "unidade": "B",
  "employerName": null,
  "schoolName": "Escola Secundária Francisco Manyanga",
  "schoolClass": "12ª A",
  "schoolNumber": "2341",
  "schoolGrade": "12",
  "bairroConfirmation": true,
  "employerConfirmation": false,
  "schoolConfirmation": true,
  "photo": "https://cdn.tmb.co.mz/passes/maria-mabunda.jpg",
  "status": "ACTIVE",
  "issueDate": "2026-07-23",
  "notes": "Primeira emissão — estudante",
  "destination": {
    "id": 1,
    "name": "Maputo",
    "status": "ACTIVE"
  },
  "category": {
    "id": 1,
    "name": "STUDENT",
    "status": "ACTIVE"
  },
  "tariff": {
    "id": 1,
    "name": "Estudante Normal 2026",
    "tariffType": "NORMAL",
    "monthlyAmount": "850.00",
    "registrationFee": "200.00"
  },
  "payments": [
    {
      "id": 1,
      "passId": 1,
      "paymentType": "REGISTRATION",
      "referenceMonth": "JULY",
      "referenceYear": 2026,
      "monthlyAmount": "850.00",
      "registrationFee": "200.00",
      "discount": "50.00",
      "totalPaid": "1000.00",
      "receiptNumber": "PASS-202607-0001",
      "paymentDate": "2026-07-23T10:15:00.000Z",
      "cashierId": 8,
      "notes": "Primeira emissão — estudante",
      "cashier": {
        "id": 8,
        "name": "Carlos Nhantumbo",
        "email": "carlos.nhantumbo@tmb.co.mz"
      }
    }
  ],
  "createdBy": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "updatedBy": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:15:00.000Z",
  "updatedAt": "2026-07-23T10:15:00.000Z",
  "deletedAt": null
}
```

**Nota sobre o cálculo do pagamento inicial:**  
`totalPaid = monthlyAmount + registrationFee - discount` → `850 + 200 - 50 = 1000.00` MZN.

---

## GET /v1/passes?page=1&limit=10

Listar passes paginados com filtros.

**Query params:**
- `page` (number, default 1)
- `limit` (number, default 50)
- `fullName` (string, opcional) - Filtro parcial no nome
- `cardNumber` (string, opcional) - Filtro parcial no número do cartão
- `identityNumber` (string, opcional) - Filtro parcial no BI
- `destinationId` (number, opcional)
- `categoryId` (number, opcional)
- `status` (enum `PassStatus`, opcional)
- `search` (string, opcional) - Pesquisa em `fullName`, `cardNumber` ou `identityNumber`
- `sortBy` (string, opcional, default: `createdAt`) - `createdAt` \| `fullName` \| `cardNumber` \| `issueDate` \| `status`
- `sortOrder` (string, opcional, default: `DESC`) - `ASC` \| `DESC`

**Exemplo:**

```
GET /v1/passes?page=1&limit=10&destinationId=1&categoryId=1&status=ACTIVE&search=Mabunda&sortBy=fullName&sortOrder=ASC
```

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 1,
      "cardNumber": "00001",
      "cardYear": 2026,
      "fullName": "Maria João Mabunda",
      "identityNumber": "110101234567A",
      "destinationId": 1,
      "categoryId": 1,
      "tariffId": 1,
      "status": "ACTIVE",
      "issueDate": "2026-07-23",
      "destination": {
        "id": 1,
        "name": "Maputo"
      },
      "category": {
        "id": 1,
        "name": "STUDENT"
      },
      "tariff": {
        "id": 1,
        "name": "Estudante Normal 2026",
        "monthlyAmount": "850.00",
        "registrationFee": "200.00"
      },
      "createdAt": "2026-07-23T10:15:00.000Z",
      "updatedAt": "2026-07-23T10:15:00.000Z"
    },
    {
      "id": 2,
      "cardNumber": "00002",
      "cardYear": 2026,
      "fullName": "João Pedro Chirindza",
      "identityNumber": "110109876543B",
      "destinationId": 2,
      "categoryId": 3,
      "tariffId": 3,
      "status": "ACTIVE",
      "issueDate": "2026-07-20",
      "destination": {
        "id": 2,
        "name": "Matola"
      },
      "category": {
        "id": 3,
        "name": "WORKER"
      },
      "tariff": {
        "id": 3,
        "name": "Trabalhador Normal 2026",
        "monthlyAmount": "1100.00",
        "registrationFee": "250.00"
      },
      "createdAt": "2026-07-20T09:00:00.000Z",
      "updatedAt": "2026-07-20T09:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 42,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

---

## GET /v1/passes/:id

Obter detalhes de um passe com relações (`destination`, `category`, `tariff`, `payments`, `payments.cashier`, `createdBy`, `updatedBy`).

**Parâmetros de URL:**
- `id` (number) - ID do passe

**Resposta:** 200 OK

```json
{
  "id": 1,
  "cardNumber": "00001",
  "cardYear": 2026,
  "fullName": "Maria João Mabunda",
  "identityNumber": "110101234567A",
  "destinationId": 1,
  "categoryId": 1,
  "tariffId": 1,
  "bairro": "Polana Cimento",
  "rua": "Av. Julius Nyerere",
  "quarteirao": "12",
  "casaNumero": "45",
  "andar": "2",
  "unidade": "B",
  "employerName": null,
  "schoolName": "Escola Secundária Francisco Manyanga",
  "schoolClass": "12ª A",
  "schoolNumber": "2341",
  "schoolGrade": "12",
  "bairroConfirmation": true,
  "employerConfirmation": false,
  "schoolConfirmation": true,
  "photo": "https://cdn.tmb.co.mz/passes/maria-mabunda.jpg",
  "status": "ACTIVE",
  "issueDate": "2026-07-23",
  "notes": "Primeira emissão — estudante",
  "destination": {
    "id": 1,
    "name": "Maputo",
    "status": "ACTIVE"
  },
  "category": {
    "id": 1,
    "name": "STUDENT",
    "status": "ACTIVE"
  },
  "tariff": {
    "id": 1,
    "name": "Estudante Normal 2026",
    "tariffType": "NORMAL",
    "monthlyAmount": "850.00",
    "registrationFee": "200.00"
  },
  "payments": [
    {
      "id": 1,
      "paymentType": "REGISTRATION",
      "referenceMonth": "JULY",
      "referenceYear": 2026,
      "monthlyAmount": "850.00",
      "registrationFee": "200.00",
      "discount": "50.00",
      "totalPaid": "1000.00",
      "receiptNumber": "PASS-202607-0001",
      "paymentDate": "2026-07-23T10:15:00.000Z",
      "cashierId": 8,
      "cashier": {
        "id": 8,
        "name": "Carlos Nhantumbo",
        "email": "carlos.nhantumbo@tmb.co.mz"
      }
    }
  ],
  "createdBy": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "updatedBy": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:15:00.000Z",
  "updatedAt": "2026-07-23T10:15:00.000Z",
  "deletedAt": null
}
```

**Resposta:** 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Pass with id 999 not found",
  "error": "Not Found"
}
```

---

## PATCH /v1/passes/:id

Actualizar parcialmente um passe. Campos de pagamento (`registerPayment`, `discount`, `referenceMonth`, `referenceYear`) **não** estão disponíveis neste endpoint.

**Parâmetros de URL:**
- `id` (number) - ID do passe

**Body (JSON):** Qualquer campo do create excepto os de pagamento

```json
{
  "fullName": "Maria João Mabunda Chirindza",
  "bairro": "Sommerschield",
  "rua": "Rua de Kassuende",
  "schoolClass": "12ª B",
  "notes": "Morada actualizada"
}
```

**Resposta:** 200 OK — mesmo formato de `GET /v1/passes/:id`

---

## DELETE /v1/passes/:id

Soft-delete de um passe.

**Parâmetros de URL:**
- `id` (number) - ID do passe

**Resposta:** 200 OK

```json
{
  "message": "Pass deleted successfully"
}
```

---

## PATCH /v1/passes/:id/status

Alterar apenas o status do passe.

**Parâmetros de URL:**
- `id` (number) - ID do passe

**Body (JSON):**

```json
{
  "status": "SUSPENDED"
}
```

**Campos:**
- `status` (enum `PassStatus`, obrigatório) - `ACTIVE` \| `EXPIRED` \| `SUSPENDED` \| `CANCELLED`

**Resposta:** 200 OK — passe actualizado (mesmo formato de `GET /v1/passes/:id`)

```json
{
  "id": 1,
  "cardNumber": "00001",
  "cardYear": 2026,
  "fullName": "Maria João Mabunda",
  "status": "SUSPENDED",
  "updatedAt": "2026-07-23T16:00:00.000Z"
}
```

---

## POST /v1/passes/renew

Renovar um passe (cria pagamento `MONTHLY` com recibo). Se o passe estiver `EXPIRED`, passa a `ACTIVE`. Não é possível renovar passes `CANCELLED` ou `SUSPENDED`.

**Body (JSON):**

```json
{
  "passId": 1,
  "referenceMonth": "AUGUST",
  "referenceYear": 2026,
  "discount": 0,
  "notes": "Renovação mensal — Agosto 2026"
}
```

**Campos:**
- `passId` (number, obrigatório) - ID do passe
- `referenceMonth` (enum `ReferenceMonth`, obrigatório)
- `referenceYear` (number, obrigatório, ≥ 2000)
- `discount` (number, opcional, ≥ 0) - Desconto em MZN
- `notes` (string, opcional)

**Resposta:** 201 Created (pagamento)

```json
{
  "id": 2,
  "passId": 1,
  "paymentType": "MONTHLY",
  "referenceMonth": "AUGUST",
  "referenceYear": 2026,
  "monthlyAmount": "850.00",
  "registrationFee": "0.00",
  "discount": "0.00",
  "totalPaid": "850.00",
  "receiptNumber": "PASS-202607-0002",
  "paymentDate": "2026-07-23T11:00:00.000Z",
  "cashierId": 8,
  "notes": "Renovação mensal — Agosto 2026",
  "createdAt": "2026-07-23T11:00:00.000Z",
  "updatedAt": "2026-07-23T11:00:00.000Z",
  "deletedAt": null
}
```

---

## POST /v1/passes/payments

Registar um pagamento manual (inscrição, mensalidade, reembolso ou ajuste).

**Body (JSON):**

```json
{
  "passId": 1,
  "paymentType": "MONTHLY",
  "referenceMonth": "SEPTEMBER",
  "referenceYear": 2026,
  "discount": 100.0,
  "notes": "Desconto por pagamento antecipado"
}
```

**Campos:**
- `passId` (number, obrigatório)
- `paymentType` (enum `PaymentType`, obrigatório) - `REGISTRATION` \| `MONTHLY` \| `REFUND` \| `ADJUSTMENT`
- `referenceMonth` (enum `ReferenceMonth`, obrigatório)
- `referenceYear` (number, obrigatório, ≥ 2000)
- `discount` (number, opcional, ≥ 0)
- `notes` (string, opcional)

**Cálculo dos valores (snapshot da tarifa actual do passe):**
- `REGISTRATION`: `monthlyAmount` + `registrationFee` − `discount`
- `MONTHLY`: `monthlyAmount` − `discount`
- `REFUND` / `ADJUSTMENT`: conforme regras internas (valores snapshot; `includeMonthlyAmount` / `includeRegistrationFee` só para `REGISTRATION` e `MONTHLY`)

**Resposta:** 201 Created

```json
{
  "id": 3,
  "passId": 1,
  "paymentType": "MONTHLY",
  "referenceMonth": "SEPTEMBER",
  "referenceYear": 2026,
  "monthlyAmount": "850.00",
  "registrationFee": "0.00",
  "discount": "100.00",
  "totalPaid": "750.00",
  "receiptNumber": "PASS-202607-0003",
  "paymentDate": "2026-07-23T12:00:00.000Z",
  "cashierId": 8,
  "notes": "Desconto por pagamento antecipado",
  "createdAt": "2026-07-23T12:00:00.000Z",
  "updatedAt": "2026-07-23T12:00:00.000Z",
  "deletedAt": null
}
```

**Conflito (pagamento duplicado):** 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Payment already exists for pass 1, SEPTEMBER/2026, type MONTHLY",
  "error": "Conflict"
}
```

---

## GET /v1/passes/payments?page=1&limit=10

Listar pagamentos paginados com filtros.

**Query params:**
- `page` (number, default 1)
- `limit` (number, default 50)
- `passId` (number, opcional)
- `destinationId` (number, opcional)
- `categoryId` (number, opcional)
- `cashierId` (number, opcional) - ID do operador/caixa
- `referenceMonth` (enum `ReferenceMonth`, opcional)
- `referenceYear` (number, opcional)
- `paymentType` (enum `PaymentType`, opcional)
- `startDate` (date string ISO, opcional) - Início do intervalo de `paymentDate`
- `endDate` (date string ISO, opcional) - Fim do intervalo de `paymentDate`
- `search` (string, opcional) - Pesquisa em nome do titular, cartão ou `receiptNumber`
- `sortBy` (string, opcional, default: `paymentDate`) - `paymentDate` \| `totalPaid` \| `referenceYear` \| `createdAt`
- `sortOrder` (string, opcional, default: `DESC`) - `ASC` \| `DESC`

**Exemplo:**

```
GET /v1/passes/payments?page=1&limit=20&destinationId=1&referenceMonth=JULY&referenceYear=2026&paymentType=MONTHLY
```

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 2,
      "passId": 1,
      "paymentType": "MONTHLY",
      "referenceMonth": "AUGUST",
      "referenceYear": 2026,
      "monthlyAmount": "850.00",
      "registrationFee": "0.00",
      "discount": "0.00",
      "totalPaid": "850.00",
      "receiptNumber": "PASS-202607-0002",
      "paymentDate": "2026-07-23T11:00:00.000Z",
      "cashierId": 8,
      "pass": {
        "id": 1,
        "cardNumber": "00001",
        "fullName": "Maria João Mabunda",
        "destination": {
          "id": 1,
          "name": "Maputo"
        },
        "category": {
          "id": 1,
          "name": "STUDENT"
        }
      },
      "cashier": {
        "id": 8,
        "name": "Carlos Nhantumbo",
        "email": "carlos.nhantumbo@tmb.co.mz"
      },
      "createdAt": "2026-07-23T11:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 15,
    "itemCount": 1,
    "itemsPerPage": 20,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## GET /v1/passes/payments/:id

Obter detalhes de um pagamento (inclui `pass`, `pass.destination`, `pass.category`, `pass.tariff`, `cashier`).

**Parâmetros de URL:**
- `id` (number) - ID do pagamento

**Resposta:** 200 OK

```json
{
  "id": 1,
  "passId": 1,
  "paymentType": "REGISTRATION",
  "referenceMonth": "JULY",
  "referenceYear": 2026,
  "monthlyAmount": "850.00",
  "registrationFee": "200.00",
  "discount": "50.00",
  "totalPaid": "1000.00",
  "receiptNumber": "PASS-202607-0001",
  "paymentDate": "2026-07-23T10:15:00.000Z",
  "cashierId": 8,
  "notes": "Primeira emissão — estudante",
  "pass": {
    "id": 1,
    "cardNumber": "00001",
    "cardYear": 2026,
    "fullName": "Maria João Mabunda",
    "identityNumber": "110101234567A",
    "status": "ACTIVE",
    "destination": {
      "id": 1,
      "name": "Maputo"
    },
    "category": {
      "id": 1,
      "name": "STUDENT"
    },
    "tariff": {
      "id": 1,
      "name": "Estudante Normal 2026",
      "monthlyAmount": "850.00",
      "registrationFee": "200.00"
    }
  },
  "cashier": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "createdBy": {
    "id": 8,
    "name": "Carlos Nhantumbo",
    "email": "carlos.nhantumbo@tmb.co.mz"
  },
  "createdAt": "2026-07-23T10:15:00.000Z",
  "updatedAt": "2026-07-23T10:15:00.000Z",
  "deletedAt": null
}
```

**Nota:** Não existem endpoints de `PATCH` ou `DELETE` para pagamentos — são imutáveis.

---

# 5. Relatórios — `/v1/pass-reports`

## GET /v1/pass-reports/revenue-by-month?year=2026

Receita agregada por mês (pagamentos `REGISTRATION` e `MONTHLY`).

**Query params:**
- `year` (number, opcional) - Filtrar por ano de referência

**Resposta:** 200 OK

```json
[
  {
    "year": 2026,
    "month": "JULY",
    "totalAmount": 185000.5,
    "paymentCount": 142
  },
  {
    "year": 2026,
    "month": "JUNE",
    "totalAmount": 172300.0,
    "paymentCount": 130
  },
  {
    "year": 2026,
    "month": "MAY",
    "totalAmount": 168450.0,
    "paymentCount": 128
  }
]
```

---

## GET /v1/pass-reports/revenue-by-category?year=2026&month=JULY

Receita agregada por categoria.

**Query params:**
- `year` (number, opcional)
- `month` (enum `ReferenceMonth`, opcional)

**Resposta:** 200 OK

```json
[
  {
    "categoryId": 1,
    "categoryName": "STUDENT",
    "totalAmount": 98000.0,
    "paymentCount": 95
  },
  {
    "categoryId": 2,
    "categoryName": "WORKER",
    "totalAmount": 87000.5,
    "paymentCount": 47
  }
]
```

---

## GET /v1/pass-reports/revenue-by-destination?year=2026&month=JULY

Receita agregada por destino.

**Query params:**
- `year` (number, opcional)
- `month` (enum `ReferenceMonth`, opcional)

**Resposta:** 200 OK

```json
[
  {
    "destinationId": 1,
    "destinationName": "Maputo",
    "totalAmount": 120500.0,
    "paymentCount": 90
  },
  {
    "destinationId": 2,
    "destinationName": "Matola",
    "totalAmount": 64500.5,
    "paymentCount": 52
  }
]
```

---

## GET /v1/pass-reports/revenue-by-operator?year=2026&month=JULY

Receita agregada por operador/caixa.

**Query params:**
- `year` (number, opcional)
- `month` (enum `ReferenceMonth`, opcional)

**Resposta:** 200 OK

```json
[
  {
    "cashierId": 8,
    "cashierName": "Carlos Nhantumbo",
    "totalAmount": 95000.0,
    "paymentCount": 78
  },
  {
    "cashierId": 12,
    "cashierName": "Fatima Sitoe",
    "totalAmount": 90000.5,
    "paymentCount": 64
  }
]
```

---

## GET /v1/pass-reports/status-counts

Contagem de passes por status.

**Resposta:** 200 OK

```json
[
  {
    "status": "ACTIVE",
    "count": 320
  },
  {
    "status": "EXPIRED",
    "count": 45
  },
  {
    "status": "SUSPENDED",
    "count": 12
  },
  {
    "status": "CANCELLED",
    "count": 8
  }
]
```

---

## GET /v1/pass-reports/summary?year=2026&month=JULY

Resumo operacional do mês.

**Query params:**
- `year` (number, opcional) - Default: ano actual
- `month` (enum `ReferenceMonth`, opcional) - Default: mês actual

**Resposta:** 200 OK

```json
{
  "newPasses": 38,
  "renewals": 104,
  "activePasses": 320,
  "expiredPasses": 45,
  "suspendedPasses": 12,
  "cancelledPasses": 8,
  "notRenewedInMonth": 27
}
```

**Campos:**
- `newPasses` - Novos passes emitidos no mês/ano
- `renewals` - Renovações (`MONTHLY`) no mês/ano
- `activePasses` - Total de passes `ACTIVE`
- `expiredPasses` - Total de passes `EXPIRED`
- `suspendedPasses` - Total de passes `SUSPENDED`
- `cancelledPasses` - Total de passes `CANCELLED`
- `notRenewedInMonth` - Passes activos sem renovação no mês de referência

---

# 6. Enums

## PassStatus

Status do passe.

| Valor | Descrição |
|---|---|
| `ACTIVE` | Passe activo |
| `EXPIRED` | Passe expirado (pode ser reactivado na renovação) |
| `SUSPENDED` | Suspenso (não pode ser renovado) |
| `CANCELLED` | Cancelado (não pode ser renovado) |

## TariffType

Tipo de tarifa.

| Valor | Descrição |
|---|---|
| `NORMAL` | Tarifa normal |
| `SPECIAL` | Tarifa especial / promocional |

## PaymentType

Tipo de pagamento.

| Valor | Descrição |
|---|---|
| `REGISTRATION` | Inscrição (taxa + mensalidade) |
| `MONTHLY` | Renovação / mensalidade |
| `REFUND` | Reembolso |
| `ADJUSTMENT` | Ajuste manual |

## EntityStatus

Status de entidades de catálogo (destino, categoria, tarifa).

| Valor | Descrição |
|---|---|
| `ACTIVE` | Activo / disponível |
| `INACTIVE` | Inactivo |

## ReferenceMonth

Mês de referência dos pagamentos e relatórios.

| Valor |
|---|
| `JANUARY` |
| `FEBRUARY` |
| `MARCH` |
| `APRIL` |
| `MAY` |
| `JUNE` |
| `JULY` |
| `AUGUST` |
| `SEPTEMBER` |
| `OCTOBER` |
| `NOVEMBER` |
| `DECEMBER` |

---

# 7. Regras de Negócio

1. **Número do cartão:** Gerado automaticamente por ano (`00001`, `00002`, …). Único por combinação `cardNumber` + `cardYear`. A sequência reinicia em cada novo ano.
2. **Recibo:** Gerado no formato `PASS-YYYYMM-NNNN` (ex.: `PASS-202607-0001`), único globalmente.
3. **Pagamentos imutáveis:** Não existem endpoints de update nem delete para pagamentos.
4. **Snapshot de valores:** Cada pagamento grava `monthlyAmount`, `registrationFee`, `discount` e `totalPaid` no momento da criação (não muda se a tarifa for alterada depois).
5. **Sem duplicados:** Não é permitido mais do que um pagamento com a mesma combinação `passId` + `referenceMonth` + `referenceYear` + `paymentType` (para `REGISTRATION` e `MONTHLY`).
6. **Soft delete:** Destinos, categorias, tarifas e passes usam soft delete (`deletedAt`). Não aparecem nas listagens normais.
7. **Consistência de relações:** Ao criar/actualizar um passe, a categoria deve pertencer ao destino e a tarifa à categoria.
8. **Renovação:** Passes `CANCELLED` ou `SUSPENDED` não podem ser renovados. Passes `EXPIRED` voltam a `ACTIVE` após renovação bem-sucedida.
9. **Valores em MZN:** Montantes monetários usam até 2 casas decimais (ex.: `850.00`).

---

# 8. Códigos de Erro Comuns

- **400 Bad Request:** Dados inválidos, renovação de passe suspenso/cancelado, datas de vigência inconsistentes
- **401 Unauthorized:** Token JWT em falta ou inválido
- **403 Forbidden:** Role sem permissão para a operação
- **404 Not Found:** Recurso não encontrado (destino, categoria, tarifa, passe ou pagamento)
- **409 Conflict:** Nome duplicado, cartão duplicado no ano, ou pagamento já existente para o mesmo mês/ano/tipo
- **500 Internal Server Error:** Erro no servidor

---

# 9. Fluxo sugerido para o frontend (menus)

1. **Catálogo**
   - Menu Destinos → CRUD `/v1/pass-destinations`
   - Menu Categorias → CRUD `/v1/pass-categories` (select de destino)
   - Menu Tarifas → CRUD `/v1/pass-tariffs` (select de categoria; mostrar `monthlyAmount` e `registrationFee` em MZN)
2. **Operação de caixa**
   - Emitir passe → `POST /v1/passes` (cascata destino → categoria → tarifa)
   - Renovar → `POST /v1/passes/renew`
   - Pagamento avulso → `POST /v1/passes/payments`
   - Consultar recibos → `GET /v1/passes/payments`
3. **Gestão de passes**
   - Listagem com filtros → `GET /v1/passes`
   - Detalhe / edição → `GET` / `PATCH /v1/passes/:id`
   - Alterar status → `PATCH /v1/passes/:id/status`
4. **Relatórios**
   - Dashboard de passes → `GET /v1/pass-reports/summary` + `status-counts`
   - Receitas → endpoints `revenue-by-*`

---

# 10. Exemplos de Uso

### Criar destino:

```bash
POST /v1/pass-destinations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Maputo",
  "description": "Cidade de Maputo",
  "status": "ACTIVE"
}
```

### Criar categoria STUDENT:

```bash
POST /v1/pass-categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "destinationId": 1,
  "name": "STUDENT"
}
```

### Emitir passe de estudante:

```bash
POST /v1/passes
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Maria João Mabunda",
  "identityNumber": "110101234567A",
  "destinationId": 1,
  "categoryId": 1,
  "tariffId": 1,
  "bairro": "Polana Cimento",
  "schoolName": "Escola Secundária Francisco Manyanga",
  "schoolConfirmation": true,
  "registerPayment": true,
  "referenceMonth": "JULY",
  "referenceYear": 2026
}
```

### Renovar passe:

```bash
POST /v1/passes/renew
Authorization: Bearer <token>
Content-Type: application/json

{
  "passId": 1,
  "referenceMonth": "AUGUST",
  "referenceYear": 2026
}
```

### Relatório de resumo:

```bash
GET /v1/pass-reports/summary?year=2026&month=JULY
Authorization: Bearer <token>
```

***
