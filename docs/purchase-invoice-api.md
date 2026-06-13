# 📄 Documentação da API — Purchase Invoice

## Visão Geral

O módulo **Purchase Invoice** (Fatura de Compra) gerencia as faturas recebidas de fornecedores, permitindo controle de pagamentos, conversão de Purchase Orders e gestão completa do ciclo de compras.

**Base URL**: `/api/v1/purchase-invoices`

## Autenticação

Todos os endpoints requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Criar Fatura de Compra
**POST** `/api/v1/purchase-invoices`

Cria uma nova fatura de compra com itens.

**Request Body:**
```json
{
  "invoice_date": "2025-10-06",
  "due_date": "2025-11-06",
  "supplier_id": 1,
  "payment_terms": "net_30",
  "tax_rate": 10,
  "discount_amount": 0,
  "discount_percentage": 0,
  "shipping_cost": 50,
  "notes": "Fatura referente aos produtos solicitados",
  "reference_number": "REF-SUPPLIER-123",
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_price": 100.00,
      "discount_percentage": 5,
      "discount_amount": 0,
      "tax_rate": 10,
      "description": "Produto exemplo",
      "unit": "un"
    },
    {
      "product_id": 2,
      "quantity": 5,
      "unit_price": 200.00,
      "discount_percentage": 0,
      "discount_amount": 25,
      "tax_rate": 10,
      "description": "Outro produto",
      "unit": "kg"
    }
  ]
}
```

**Response:**  
`201 Created`
```json
{
  "id": 1,
  "invoice_number": "FTC-202510-0001",
  "invoice_date": "2025-10-06",
  "due_date": "2025-11-06",
  "status": "draft",
  "payment_terms": "net_30",
  "supplier_id": 1,
  "purchase_order_id": null,
  "subtotal": 1925.00,
  "tax_rate": 10,
  "tax_amount": 192.50,
  "discount_amount": 0,
  "discount_percentage": 0,
  "shipping_cost": 50.00,
  "total_amount": 2167.50,
  "amount_paid": 0,
  "balance_due": 2167.50,
  "notes": "Fatura referente aos produtos solicitados",
  "reference_number": "REF-SUPPLIER-123",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 10,
      "unit_price": 100.00,
      "line_total": 950.00,
      "tax_amount": 95.00,
      "description": "Produto exemplo"
    }
  ],
  "created_at": "2025-10-06T10:00:00Z",
  "updated_at": "2025-10-06T10:00:00Z"
}
```

---

### 2. Listar Faturas de Compra
**GET** `/api/v1/purchase-invoices`

Lista faturas com filtros e paginação.

**Query Parameters:**
- `page` (number, opcional, default: 1) - Página atual
- `limit` (number, opcional, default: 10) - Itens por página
- `status` (string, opcional) - Filtrar por status
- `supplier_id` (number, opcional) - Filtrar por fornecedor
- `search` (string, opcional) - Buscar por número, fornecedor ou referência
- `overdue` (boolean, opcional) - Filtrar apenas faturas vencidas

**Valores de Status:**
- `draft` - Rascunho
- `received` - Recebida
- `paid` - Paga
- `partially_paid` - Parcialmente paga
- `overdue` - Vencida
- `cancelled` - Cancelada

**Exemplo de Request:**
```
GET /api/v1/purchase-invoices?page=1&limit=25&status=received&supplier_id=5&search=FTC-2025&overdue=false
```

**Response:**  
`200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "invoice_number": "FTC-202510-0001",
      "invoice_date": "2025-10-06",
      "due_date": "2025-11-06",
      "status": "received",
      "total_amount": 2167.50,
      "balance_due": 2167.50,
      "supplier": {
        "id": 1,
        "name": "Fornecedor ABC Ltda",
        "email": "contato@fornecedorabc.com"
      },
      "items": [...]
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 25,
  "totalPages": 6
}
```

---

### 3. Buscar Fatura por ID
**GET** `/api/v1/purchase-invoices/:id`

Retorna uma fatura específica com todos os detalhes.

**Response:**  
`200 OK`
```json
{
  "id": 1,
  "invoice_number": "FTC-202510-0001",
  "invoice_date": "2025-10-06",
  "due_date": "2025-11-06",
  "status": "received",
  "payment_terms": "net_30",
  "supplier": {
    "id": 1,
    "name": "Fornecedor ABC Ltda",
    "email": "contato@fornecedorabc.com",
    "phone": "+244 900 000 000"
  },
  "purchase_order": {
    "id": 2,
    "order_number": "PO-202510-0002",
    "status": "received"
  },
  "subtotal": 1925.00,
  "tax_rate": 10,
  "tax_amount": 192.50,
  "total_amount": 2167.50,
  "amount_paid": 0,
  "balance_due": 2167.50,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Produto Exemplo",
        "sku": "PROD-001"
      },
      "quantity": 10,
      "unit_price": 100.00,
      "discount_percentage": 5,
      "tax_rate": 10,
      "line_total": 950.00,
      "description": "Produto exemplo"
    }
  ]
}
```

---

### 4. Atualizar Fatura
**PATCH** `/api/v1/purchase-invoices/:id`

Atualiza uma fatura existente. Todos os campos são opcionais.

**Request Body:** (mesmo formato do create, mas todos os campos opcionais)
```json
{
  "due_date": "2025-12-06",
  "notes": "Observação atualizada",
  "shipping_cost": 75.00
}
```

**Response:**  
`200 OK` - Retorna o objeto da fatura atualizada.

**Regras:**
- Faturas com status `paid` não podem ser atualizadas
- Faturas com pagamentos não podem ser deletadas

---

### 5. Deletar Fatura
**DELETE** `/api/v1/purchase-invoices/:id`

Remove uma fatura (soft delete).

**Response:**  
`200 OK`
```json
{
  "message": "Purchase invoice deleted successfully"
}
```

**Regras:**
- Apenas faturas sem pagamentos podem ser deletadas

---

### 6. Atualizar Status da Fatura
**PATCH** `/api/v1/purchase-invoices/:id/status`

Atualiza apenas o status da fatura.

**Request Body:**
```json
{
  "status": "paid"
}
```

**Valores possíveis:**
- `draft` - Rascunho
- `received` - Recebida
- `paid` - Paga
- `partially_paid` - Parcialmente paga
- `overdue` - Vencida
- `cancelled` - Cancelada

**Response:**  
`200 OK` - Retorna o objeto da fatura atualizada.

---

### 7. Registrar Pagamento
**POST** `/api/v1/purchase-invoices/:id/payment`

Registra um pagamento para a fatura. Permite pagamentos parciais.

**Request Body:**
```json
{
  "amount": 1000.00,
  "payment_date": "2025-10-06",
  "payment_method": "bank_transfer",
  "reference_number": "TRF-789456",
  "notes": "Pagamento parcial via transferência bancária"
}
```

**Métodos de Pagamento Sugeridos:**
- `cash` - Dinheiro
- `bank_transfer` - Transferência bancária
- `check` - Cheque
- `credit_card` - Cartão de crédito
- `debit_card` - Cartão de débito
- `pix` - PIX
- `other` - Outro

**Response:**  
`200 OK`
```json
{
  "id": 1,
  "total_amount": 2167.50,
  "amount_paid": 1000.00,
  "balance_due": 1167.50,
  "status": "partially_paid",
  "updated_at": "2025-10-06T15:30:00Z"
}
```

**Regras:**
- O valor do pagamento não pode exceder o saldo devedor
- O status é atualizado automaticamente:
  - `partially_paid` se ainda há saldo
  - `paid` se o valor total foi pago

---

### 8. Converter Purchase Order em Purchase Invoice
**POST** `/api/v1/purchase-invoices/convert-from-po/:poId`

Converte uma Purchase Order existente em Purchase Invoice.

**Request Body:**
```json
{
  "invoice_date": "2025-10-06",
  "due_date": "2025-11-06",
  "payment_terms": "net_30",
  "notes": "Fatura gerada automaticamente da PO #PO-202510-0002",
  "reference_number": "REF-PO-0002",
  "keep_po_notes": true
}
```

**Campos Opcionais:**
- `payment_terms` - Condições de pagamento (default: net_30)
- `notes` - Observações da fatura
- `reference_number` - Número de referência
- `keep_po_notes` - Se true, mantém as observações da PO

**Response:**  
`201 Created` - Retorna a fatura criada com todos os itens da PO copiados.

**Regras:**
- A Purchase Order deve existir e pertencer à organização
- Não é possível converter uma PO que já possui fatura
- Todos os itens da PO são copiados automaticamente
- Os valores são copiados da PO (subtotal, impostos, desconto)

---

## Modelos de Dados

### PurchaseInvoice (Completo)
```json
{
  "id": 1,
  "invoice_number": "FTC-202510-0001",
  "invoice_date": "2025-10-06",
  "due_date": "2025-11-06",
  "status": "received",
  "payment_terms": "net_30",
  "organization_id": 1,
  "supplier_id": 1,
  "purchase_order_id": 2,
  "created_by": 1,
  "updated_by": 1,
  "subtotal": 1925.00,
  "tax_rate": 10.00,
  "tax_amount": 192.50,
  "discount_amount": 0.00,
  "discount_percentage": 0.00,
  "shipping_cost": 50.00,
  "total_amount": 2167.50,
  "amount_paid": 0.00,
  "balance_due": 2167.50,
  "notes": "Observações da fatura",
  "internal_notes": "Notas internas (não visíveis ao fornecedor)",
  "reference_number": "REF-SUPPLIER-123",
  "supplier": { /* objeto Supplier */ },
  "purchase_order": { /* objeto PurchaseOrder */ },
  "items": [ /* array de PurchaseInvoiceItem */ ],
  "created_at": "2025-10-06T10:00:00Z",
  "updated_at": "2025-10-06T10:00:00Z",
  "deleted_at": null
}
```

### PurchaseInvoiceItem (Completo)
```json
{
  "id": 1,
  "purchase_invoice_id": 1,
  "product_id": 1,
  "purchase_order_item_id": 1,
  "quantity": 10.000,
  "unit_price": 100.00,
  "discount_percentage": 5.00,
  "discount_amount": 0.00,
  "tax_rate": 10.00,
  "tax_amount": 95.00,
  "line_total": 950.00,
  "description": "Produto exemplo detalhado",
  "unit": "un",
  "product": {
    "id": 1,
    "name": "Produto Exemplo",
    "sku": "PROD-001",
    "description": "Descrição do produto"
  },
  "created_at": "2025-10-06T10:00:00Z",
  "updated_at": "2025-10-06T10:00:00Z"
}
```

---

## Códigos de Erro

### Erros Comuns

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "supplier_id must be a number"
  ]
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Purchase invoice not found"
}
```

**409 Conflict**
```json
{
  "statusCode": 409,
  "message": "Purchase Order already has an invoice"
}
```

---

## Regras de Negócio

### Status da Fatura
1. **draft** → **received** → **paid**
2. Pagamentos parciais alteram status para **partially_paid**
3. Faturas vencidas são marcadas como **overdue**
4. **cancelled** pode ser aplicado a qualquer momento

### Validações
- Supplier deve existir e estar ativo
- Produtos dos itens devem existir
- Quantidades devem ser > 0
- Valores não podem ser negativos
- Data de vencimento deve ser >= data da fatura

### Cálculos Automáticos
```
linha_total = (quantidade × preço_unitário) - desconto_linha
subtotal = soma(todas_linhas_total)
imposto_total = soma(linha_total × taxa_imposto)
total_geral = subtotal + imposto_total + frete - desconto_geral
```

---

## Exemplo de Integração Frontend

### React/JavaScript - Criar Fatura
```javascript
const createPurchaseInvoice = async (invoiceData) => {
  try {
    const response = await fetch('/api/v1/purchase-invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoiceData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};
```

### React/JavaScript - Listar com Filtros
```javascript
const fetchPurchaseInvoices = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  
  try {
    const response = await fetch(`/api/v1/purchase-invoices?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};
```

---

## Notas Importantes

1. **Multi-tenancy**: Todas as operações são isoladas por organização
2. **Soft Delete**: Registros deletados são mantidos para auditoria
3. **Numeração Automática**: Formato FTC-YYYYMM-XXXX gerado automaticamente
4. **Validação de Campos**: Class-validator implementado em todos DTOs
5. **Relacionamentos**: Eager loading otimizado para performance
6. **Timestamps**: created_at/updated_at mantidos automaticamente

---

*Documentação gerada em: 6 de outubro de 2025*
*Versão da API: v1*