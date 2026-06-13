# API de Perfil do Usuário (User Profile) - v1

Base path: `/v1/users/profile`

## GET /v1/users/profile/me

Obter informações do perfil do usuário logado.

**Autenticação:** Requerida (qualquer role: ADMIN, OPERATOR, USER)

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta:** 200 OK

```json
{
  "id": 5,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "OPERATOR",
  "is_active": 1,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-20T14:30:00.000Z"
}
```

**Observações:**
- Retorna apenas os dados do usuário autenticado
- Senha não é retornada por segurança

---

## PATCH /v1/users/profile/me

Atualizar dados do perfil do usuário logado.

**Autenticação:** Requerida (qualquer role: ADMIN, OPERATOR, USER)

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):** Todos os campos são opcionais

```json
{
  "name": "João Silva Jr.",
  "email": "joao.novo@example.com",
  "mobile": "999999999"
}
```

**Campos:**
- `name` (string, opcional) - Nome do usuário
- `email` (string, opcional) - Email (deve ser válido e único)
- `mobile` (string, opcional) - Telefone/celular

**Resposta:** 200 OK

```json
{
  "id": 5,
  "name": "João Silva Jr.",
  "email": "joao.novo@example.com",
  "role": "OPERATOR",
  "is_active": 1,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-25T16:45:00.000Z"
}
```

**Validações:**
- Email deve ser válido
- Email não pode estar em uso por outro usuário

**Erros Possíveis:**

**400 Bad Request** - Email já em uso
```json
{
  "statusCode": 400,
  "message": "Email already in use",
  "error": "Bad Request"
}
```

**404 Not Found** - Usuário não encontrado
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## POST /v1/users/profile/change-password

Alterar senha do usuário logado.

**Autenticação:** Requerida (qualquer role: ADMIN, OPERATOR, USER)

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):**

```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

**Campos:**
- `currentPassword` (string, obrigatório) - Senha atual do usuário
- `newPassword` (string, obrigatório) - Nova senha (mínimo 6 caracteres)

**Resposta:** 200 OK

```json
{
  "message": "Password changed successfully"
}
```

**Validações:**
- `currentPassword` deve ser fornecida e correta
- `newPassword` deve ter no mínimo 6 caracteres
- Senha atual é verificada antes de permitir a mudança

**Erros Possíveis:**

**400 Bad Request** - Senha atual incorreta
```json
{
  "statusCode": 400,
  "message": "Current password is incorrect",
  "error": "Bad Request"
}
```

**400 Bad Request** - Validação falhou
```json
{
  "statusCode": 400,
  "message": [
    "newPassword must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

**404 Not Found** - Usuário não encontrado
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

**401 Unauthorized** - Token ausente ou inválido
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Observações Gerais

1. **Autenticação Obrigatória:** Todos os endpoints requerem token JWT válido no header Authorization
2. **Segurança:** 
   - Senha atual é verificada antes de permitir mudança
   - Nova senha é criptografada com bcrypt antes de salvar
   - Senha nunca é retornada nas respostas
3. **Validação de Email:** Ao atualizar email, o sistema verifica se já está em uso
4. **Acessibilidade:** Qualquer usuário autenticado pode acessar seu próprio perfil
5. **Atualização Parcial:** No endpoint PATCH, apenas os campos enviados são atualizados

---

## Exemplos de Uso

### Obter perfil do usuário logado:
```bash
GET /v1/users/profile/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Atualizar nome e email:
```bash
PATCH /v1/users/profile/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria.santos@example.com"
}
```

### Alterar senha:
```bash
POST /v1/users/profile/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "minhasenha123",
  "newPassword": "novasenha456"
}
```

---

## Fluxo Típico de Uso

1. Usuário faz login e recebe token JWT
2. Acessa GET /v1/users/profile/me para visualizar seus dados
3. Se necessário, atualiza informações com PATCH /v1/users/profile/me
4. Para alterar senha, usa POST /v1/users/profile/change-password
5. Sistema valida senha atual antes de permitir mudança
6. Após mudança de senha, usuário pode continuar usando o mesmo token (não expira automaticamente)

***

- [Exemplos de Uso](#exemplos-de-uso)

---

## 🔐 Autenticação

Todos os endpoints requerem autenticação via JWT Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Endpoints do Perfil

### 1. 👤 Visualizar Meu Perfil Completo

**GET** `/api/v1/profile/me`

Retorna informações completas do perfil do usuário autenticado.

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "admin@empresa.com",
      "is_active": 1,
      "role": "admin",
      "organization_id": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    "profile": {
      "id": 1,
      "first_name": "João",
      "last_name": "Silva",
      "address": "Rua das Flores, 123",
      "mobile": "+55 11 99999-9999",
      "user_id": 1,
      "organization_id": 1
    },
    "organization": {
      "id": 1,
      "name": "Empresa XYZ Ltda",
      "address": "Rua das Flores, 123",
      "mobile": "+55 11 1234-5678",
      "city": "São Paulo",
      "nuit": "123456789",
      "logo": "uploads/organizations/logo.png",
      "is_active": 1,
      "trial_expires_at": "2024-12-31T23:59:59.000Z",
      "email_notifications": true,
      "sales_alerts": true,
      "inventory_alerts": false,
      "setup_completed": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

#### Response Error (400)
```json
{
  "message": "Error fetching profile: User not found",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 2. ✏️ Atualizar Meu Perfil

**PATCH** `/api/v1/profile/me`

Atualiza informações do perfil do usuário autenticado.

#### Request Body
```json
{
  "name": "João Carlos Silva",
  "email": "joao.silva@empresa.com",
  "first_name": "João Carlos",
  "last_name": "Silva Santos",
  "mobile": "+55 11 88888-8888",
  "address": "Nova Rua, 456"
}
```

#### Validações
- `name`: Opcional, string, máximo 100 caracteres (User)
- `email`: Opcional, email válido, único no sistema (User)
- `first_name`: Opcional, string, máximo 100 caracteres (Profile)
- `last_name`: Opcional, string, máximo 100 caracteres (Profile)
- `mobile`: Opcional, string, formato válido de telefone (Profile)
- `address`: Opcional, string, endereço completo (Profile)

#### Response Success (200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "João Carlos Silva",
      "email": "joao.silva@empresa.com",
      "is_active": 1,
      "organization_id": 1,
      "updatedAt": "2024-01-20T16:30:00.000Z"
    },
    "profile": {
      "id": 1,
      "first_name": "João Carlos",
      "last_name": "Silva Santos",
      "mobile": "+55 11 88888-8888",
      "address": "Nova Rua, 456",
      "user_id": 1,
      "organization_id": 1
    }
  }
}
```

#### Response Error (400)
```json
{
  "message": [
    "email must be a valid email",
    "firstName must be shorter than or equal to 100 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 3. 🔐 Alterar Senha

**POST** `/api/v1/profile/change-password`

Permite ao usuário alterar sua senha atual.

#### Request Body
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456!",
  "confirmNewPassword": "novaSenha456!"
}
```

#### Validações
- `currentPassword`: Obrigatório, string, mínimo 6 caracteres
- `newPassword`: Obrigatório, string, mínimo 6 caracteres, deve ser diferente da senha atual
- `confirmNewPassword`: Obrigatório, deve ser igual ao `newPassword`

#### Response Success (200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Response Error (400)
```json
{
  "message": "Current password is incorrect",
  "error": "Bad Request", 
  "statusCode": 400
}
```

#### Response Error - Validação (400)
```json
{
  "message": [
    "newPassword must be longer than or equal to 6 characters",
    "confirmNewPassword must match newPassword"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 4. 🏢 Visualizar Minha Organização

**GET** `/api/v1/profile/organization`

Retorna informações detalhadas da organização do usuário.

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Empresa XYZ Ltda",
    "address": "Rua das Flores, 123",
    "mobile": "+55 11 1234-5678",
    "city": "São Paulo",
    "nuit": "123456789",
    "logo": "uploads/organizations/logo.png",
    "is_active": 1,
    "trial_expires_at": "2024-12-31T23:59:59.000Z",
    "email_notifications": true,
    "sales_alerts": true,
    "inventory_alerts": false,
    "setup_completed": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "usersCount": 25,
    "businessType": {
      "id": 1,
      "name": "Tecnologia",
      "description": "Empresas de tecnologia e software"
    }
  }
}
```

#### Response Error (404)
```json
{
  "message": "Organization not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 5. 📊 Dashboard do Perfil

**GET** `/api/v1/profile/dashboard`

Retorna estatísticas e informações do dashboard pessoal do usuário.

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@empresa.com",
      "firstName": "João",
      "lastName": "Silva",
      "lastLoginAt": "2024-01-20T08:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "organization": {
      "id": 1,
      "name": "Empresa XYZ Ltda",
      "email": "contato@empresa.com",
      "phone": "+55 11 1234-5678",
      "email_notifications": true,
      "sales_alerts": true,
      "inventory_alerts": false,
      "usersCount": 25,
      "isActive": true
    },
    "statistics": {
      "totalLogins": 45,
      "profileCompleteness": 85,
      "accountAge": 30,
      "lastActivity": "2024-01-20T16:45:00.000Z"
    },
    "recentActivity": [
      {
        "type": "profile_update",
        "description": "Perfil atualizado",
        "timestamp": "2024-01-20T15:30:00.000Z"
      },
      {
        "type": "password_change", 
        "description": "Senha alterada",
        "timestamp": "2024-01-19T10:15:00.000Z"
      }
    ],
    "notifications": {
      "unreadCount": 3,
      "total": 12
    }
  }
}
```

---

## 🗂️ Estruturas de Dados

### UpdateUserProfileDto
```typescript
interface UpdateUserProfileDto {
  firstName?: string;     // Máximo 100 caracteres
  lastName?: string;      // Máximo 100 caracteres
  phone?: string;         // Formato válido de telefone
  email?: string;         // Email válido e único
}
```

### ChangePasswordDto
```typescript
interface ChangePasswordDto {
  currentPassword: string;      // Mínimo 6 caracteres
  newPassword: string;          // Mínimo 6 caracteres
  confirmNewPassword: string;   // Deve ser igual a newPassword
}
```

### User Entity
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  organizationId: number;
}
```

### Organization Entity  
```typescript
interface Organization {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  industry?: string;
  size?: 'Small' | 'Medium' | 'Large';
  logo?: string;
  isActive: boolean;
  email_notifications?: boolean;
  sales_alerts?: boolean;
  inventory_alerts?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📟 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | ✅ Sucesso - Operação realizada com sucesso |
| 400 | ❌ Bad Request - Dados inválidos ou erro de validação |
| 401 | 🔒 Unauthorized - Token não fornecido ou inválido |
| 403 | 🚫 Forbidden - Usuário não tem permissão |
| 404 | 📭 Not Found - Recurso não encontrado |
| 500 | ⚠️ Internal Server Error - Erro interno do servidor |

---

## 💻 Exemplos de Uso

### React/TypeScript - Hook para Profile

```typescript
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

interface ProfileData {
  user: User;
  organization: Organization;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile/me');
      setProfile(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateUserProfileDto) => {
    try {
      const response = await api.patch('/profile/me', data);
      setProfile(prev => prev ? {
        ...prev,
        user: { ...prev.user, ...response.data.data }
      } : null);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  const changePassword = async (data: ChangePasswordDto) => {
    try {
      const response = await api.post('/profile/change-password', data);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    refetch: fetchProfile
  };
};
```

### React Component - Profile Form

```tsx
// components/ProfileForm.tsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

export const ProfileForm: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    firstName: profile?.user.firstName || '',
    lastName: profile?.user.lastName || '',
    phone: profile?.user.phone || '',
    email: profile?.user.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sobrenome
        </label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Atualizar Perfil'}
      </button>
    </form>
  );
};
```

### React Component - Change Password Form

```tsx
// components/ChangePasswordForm.tsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

export const ChangePasswordForm: React.FC = () => {
  const { changePassword } = useProfile();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('Nova senha e confirmação devem ser iguais');
      return;
    }

    setLoading(true);
    
    try {
      await changePassword(formData);
      alert('Senha alterada com sucesso!');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Senha Atual
        </label>
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nova Senha
        </label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          minLength={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirmar Nova Senha
        </label>
        <input
          type="password"
          value={formData.confirmNewPassword}
          onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {loading ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </form>
  );
};
```

### Axios API Service

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔧 Configuração no Frontend

### Variáveis de Ambiente
```env
# .env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

### TypeScript Types
```typescript
// types/profile.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  organizationId: number;
}

export interface Organization {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  industry?: string;
  size?: 'Small' | 'Medium' | 'Large';
  logo?: string;
  isActive: boolean;
  email_notifications?: boolean;
  sales_alerts?: boolean;
  inventory_alerts?: boolean;
  usersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

---

## 📝 Notas Importantes

1. **Autenticação**: Todos os endpoints requerem token JWT válido
2. **Validação**: Campos são validados no backend com mensagens detalhadas
3. **Segurança**: Senhas são criptografadas com bcrypt
4. **Performance**: Utilizar cache para dados de perfil quando apropriado
5. **Tratamento de Erros**: Sempre tratar erros de rede e validação
6. **UX**: Mostrar loading states durante operações assíncronas

---

Esta documentação fornece todos os detalhes necessários para integrar os endpoints de perfil no frontend. Para dúvidas ou suporte adicional, consulte a documentação da API completa ou entre em contato com a equipe de desenvolvimento.