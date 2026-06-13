# 🏢 Documentação da API — Organization (Admin)

## Visão Geral

O módulo **Organization** permite que usuários administradores visualizem e atualizem todas as informações da sua organização, incluindo dados básicos, configurações e preferências.

**Base URL**: `/api/v1/organizations`

## Autenticação

Todos os endpoints requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Visualizar Perfil da Organização
**GET** `/api/v1/organizations/profile`

Retorna todas as informações detalhadas da organização do usuário logado.

**Response:**  
`200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Minha Empresa Lda",
    "nuit": "123456789",
    "address": "Rua da Paz, 123, Maputo",
    "city": "Maputo",
    "mobile": "+258 84 123 4567",
    "logo": "https://example.com/logo.png",
    "trial_expires_at": "2025-11-06T00:00:00Z",
    "is_active": 1,
    "email_notifications": true,
    "sales_alerts": true,
    "inventory_alerts": false,
    "setup_completed": true,
    "setup_completed_at": "2025-10-01T10:00:00Z",
    "plan": {
      "id": 1,
      "name": "Professional",
      "user_limit": 50,
      "monthly_price": 2500
    },
    "businessType": {
      "id": 2,
      "name": "Comércio Retalhista",
      "code": "retail",
      "description": "Venda direta ao consumidor"
    },
    "province": {
      "id": 1,
      "name": "Maputo Cidade",
      "code": "maputo_city"
    },
    "currency": {
      "id": 1,
      "name": "Metical Moçambicano",
      "code": "MZN",
      "symbol": "MT"
    },
    "language": {
      "id": 1,
      "name": "Português",
      "code": "pt"
    },
    "timezone": {
      "id": 1,
      "name": "Africa/Maputo",
      "description": "Maputo, Moçambique"
    },
    "createdAt": "2025-09-01T00:00:00Z",
    "updatedAt": "2025-10-06T15:30:00Z"
  }
}
```

---

### 2. Atualizar Perfil da Organização
**PATCH** `/api/v1/organizations/profile`

Atualiza as informações da organização. Todos os campos são opcionais.

**Request Body:**
```json
{
  "name": "Nova Empresa Lda",
  "nuit": "987654321",
  "address": "Avenida Julius Nyerere, 456",
  "city": "Beira",
  "mobile": "+258 84 987 6543",
  "logo": "https://example.com/new-logo.png",
  "business_type_id": 3,
  "province_id": 2,
  "currency_id": 1,
  "language_id": 2,
  "timezone_id": 1,
  "email_notifications": true,
  "sales_alerts": false,
  "inventory_alerts": true
}
```

**Campos Disponíveis:**
- `name` (string) - Nome da empresa
- `nuit` (string) - NUIT da empresa
- `address` (string) - Endereço completo
- `city` (string) - Cidade
- `mobile` (string) - Telefone móvel
- `logo` (string, URL) - URL do logotipo
- `business_type_id` (number) - ID do tipo de negócio
- `province_id` (number) - ID da província
- `currency_id` (number) - ID da moeda
- `language_id` (number) - ID do idioma
- `timezone_id` (number) - ID do fuso horário
- `email_notifications` (boolean) - Ativar notificações por email
- `sales_alerts` (boolean) - Ativar alertas de vendas
- `inventory_alerts` (boolean) - Ativar alertas de estoque

**Response:**  
`200 OK`
```json
{
  "success": true,
  "message": "Perfil da organização atualizado com sucesso",
  "data": {
    // Objeto completo da organização atualizada
    "id": 1,
    "name": "Nova Empresa Lda",
    "nuit": "987654321",
    // ... outros campos
  }
}
```

---

### 3. Dashboard da Organização
**GET** `/api/v1/organizations/dashboard`

Retorna informações resumidas da organização para exibição no dashboard.

**Response:**  
`200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Minha Empresa Lda",
    "nuit": "123456789",
    "city": "Maputo",
    "logo": "https://example.com/logo.png",
    "setup_completed": true,
    "trial_expires_at": "2025-11-06T00:00:00Z",
    "is_active": 1,
    "plan": {
      "id": 1,
      "name": "Professional",
      "user_limit": 50,
      "monthly_price": 2500
    },
    "currency": {
      "id": 1,
      "name": "Metical Moçambicano",
      "code": "MZN",
      "symbol": "MT"
    },
    "language": {
      "id": 1,
      "name": "Português",
      "code": "pt"
    }
  }
}
```

---

### 4. Opções de Configuração
**GET** `/api/v1/organizations/config-options`

Retorna todas as opções disponíveis para configuração da organização (para popular dropdowns no frontend).

**Response:**  
`200 OK`
```json
{
  "success": true,
  "data": {
    "businessTypes": [
      {
        "id": 1,
        "name": "Comércio Grossista",
        "code": "wholesale",
        "description": "Venda para revenda"
      },
      {
        "id": 2,
        "name": "Comércio Retalhista",
        "code": "retail",
        "description": "Venda direta ao consumidor"
      },
      {
        "id": 3,
        "name": "Restaurante",
        "code": "restaurant",
        "description": "Serviços de alimentação"
      }
    ],
    "provinces": [
      {
        "id": 1,
        "name": "Maputo Cidade",
        "code": "maputo_city"
      },
      {
        "id": 2,
        "name": "Maputo Província",
        "code": "maputo_province"
      },
      {
        "id": 3,
        "name": "Gaza",
        "code": "gaza"
      }
    ],
    "currencies": [
      {
        "id": 1,
        "name": "Metical Moçambicano",
        "code": "MZN",
        "symbol": "MT"
      },
      {
        "id": 2,
        "name": "Dólar Americano",
        "code": "USD",
        "symbol": "$"
      }
    ],
    "languages": [
      {
        "id": 1,
        "name": "Português",
        "code": "pt"
      },
      {
        "id": 2,
        "name": "English",
        "code": "en"
      }
    ],
    "timezones": [
      {
        "id": 1,
        "name": "Africa/Maputo",
        "description": "Maputo, Moçambique"
      }
    ],
    "plans": [
      {
        "id": 1,
        "name": "Free",
        "user_limit": 5,
        "monthly_price": 0
      },
      {
        "id": 2,
        "name": "Professional",
        "user_limit": 50,
        "monthly_price": 2500
      }
    ]
  }
}
```

---

### 5. Completar Setup (Legado)
**POST** `/api/v1/organizations/complete-setup`

Endpoint legado para completar o setup inicial da organização.

**Request Body:**
```json
{
  "name": "Minha Empresa",
  "nuit": "123456789",
  "address": "Endereço da empresa",
  "city": "Maputo",
  "province": "maputo_city",
  "email_notifications": true,
  "sales_alerts": true,
  "inventory_alerts": true
}
```

**Response:**  
`200 OK`
```json
{
  "message": "Organização atualizada com sucesso",
  "organization": {
    // Objeto da organização
  }
}
```

---

## Códigos de Erro

### Erros Comuns

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Usuário não tem organização associada"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Organização não encontrada"
}
```

**422 Validation Error**
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    "name must be a string",
    "nuit must be shorter than or equal to 20 characters"
  ]
}
```

---

## Validações

### Campos Obrigatórios
- Nenhum campo é obrigatório no PATCH `/profile`
- O sistema permite atualizações parciais

### Limites de Caracteres
- `name`: máximo 255 caracteres
- `nuit`: máximo 20 caracteres
- `address`: máximo 500 caracteres
- `city`: máximo 100 caracteres
- `mobile`: máximo 20 caracteres
- `logo`: deve ser uma URL válida

### Validações de Relacionamento
- `business_type_id`, `province_id`, `currency_id`, `language_id`, `timezone_id` devem referenciar registros existentes
- Se um ID não existir, o campo será ignorado (não gerará erro)

---

## Exemplo de Integração Frontend

### React/JavaScript - Buscar Perfil da Organização
```javascript
const fetchOrganizationProfile = async () => {
  try {
    const response = await fetch('/api/v1/organizations/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch organization profile');
    }
    
    const data = await response.json();
    return data.data; // Objeto da organização
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    throw error;
  }
};
```

### React/JavaScript - Atualizar Perfil
```javascript
const updateOrganizationProfile = async (updateData) => {
  try {
    const response = await fetch('/api/v1/organizations/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update organization profile');
    }
    
    const data = await response.json();
    return data.data; // Organização atualizada
  } catch (error) {
    console.error('Error updating organization profile:', error);
    throw error;
  }
};
```

### React/JavaScript - Buscar Opções de Configuração
```javascript
const fetchConfigOptions = async () => {
  try {
    const response = await fetch('/api/v1/organizations/config-options', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data.data; // { businessTypes, provinces, currencies, languages, timezones, plans }
  } catch (error) {
    console.error('Error fetching config options:', error);
    throw error;
  }
};
```

---

## Casos de Uso Frontend

### 1. Página de Configurações da Empresa
```javascript
// Componente para página de configurações
const OrganizationSettings = () => {
  const [organization, setOrganization] = useState(null);
  const [configOptions, setConfigOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgData, options] = await Promise.all([
          fetchOrganizationProfile(),
          fetchConfigOptions()
        ]);
        
        setOrganization(orgData);
        setConfigOptions(options);
      } catch (error) {
        // Tratar erro
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async (formData) => {
    try {
      const updated = await updateOrganizationProfile(formData);
      setOrganization(updated);
      // Mostrar mensagem de sucesso
    } catch (error) {
      // Mostrar mensagem de erro
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <form onSubmit={handleSave}>
      <input 
        name="name" 
        defaultValue={organization.name}
        placeholder="Nome da empresa" 
      />
      
      <select 
        name="business_type_id" 
        defaultValue={organization.businessType?.id}
      >
        {configOptions.businessTypes.map(bt => (
          <option key={bt.id} value={bt.id}>{bt.name}</option>
        ))}
      </select>
      
      {/* Outros campos... */}
      
      <button type="submit">Salvar</button>
    </form>
  );
};
```

### 2. Header/Dashboard com Info da Empresa
```javascript
const CompanyHeader = () => {
  const [orgInfo, setOrgInfo] = useState(null);

  useEffect(() => {
    const loadDashboardInfo = async () => {
      try {
        const response = await fetch('/api/v1/organizations/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setOrgInfo(data.data);
      } catch (error) {
        console.error('Error loading organization info:', error);
      }
    };

    loadDashboardInfo();
  }, []);

  if (!orgInfo) return null;

  return (
    <div className="company-header">
      <img src={orgInfo.logo} alt={orgInfo.name} />
      <h1>{orgInfo.name}</h1>
      <p>{orgInfo.city}</p>
      <span className="plan-badge">{orgInfo.plan?.name}</span>
    </div>
  );
};
```

---

## Notas Importantes

1. **Multi-tenancy**: Todos os endpoints respeitam automaticamente a organização do usuário logado
2. **Permissões**: Apenas usuários da própria organização podem ver/editar seus dados
3. **Relacionamentos**: Os endpoints retornam objetos completos dos relacionamentos (plan, businessType, etc.)
4. **Flexibilidade**: O endpoint PATCH permite atualizações parciais - envie apenas os campos que deseja alterar
5. **Configurações**: Use o endpoint `/config-options` para popular dropdowns e selects no frontend
6. **Cache**: Considere cachear as opções de configuração pois elas mudam raramente

---

*Documentação gerada em: 6 de outubro de 2025*
*Versão da API: v1*