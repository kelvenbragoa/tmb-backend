#!/bin/bash

# Script de teste para dashboard

echo "Iniciando servidor em background..."
npm start &
SERVER_PID=$!

# Aguardar servidor inicializar
sleep 10

echo "Fazendo login para obter token..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "12345678"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo "Testando endpoint /api/v1/dashboard/overview..."
  curl -X GET http://localhost:3000/api/v1/dashboard/overview \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq .

  echo -e "\n\nTestando endpoint /api/v1/dashboard..."
  curl -X GET http://localhost:3000/api/v1/dashboard \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq .
else
  echo "Erro ao obter token"
fi

# Matar servidor
kill $SERVER_PID