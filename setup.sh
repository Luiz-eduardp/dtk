#!/bin/bash

# DTK Quick Start Script
# Execute este script para setup rápido

set -e

echo "🚀 DTK - Quick Setup"
echo "==================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Setup completo!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Iniciar desenvolvimento:"
echo "   npm run dev"
echo ""
echo "2️⃣  Build para produção:"
echo "   npm run build"
echo ""
echo "3️⃣  Empacotar aplicação:"
echo "   npm run package"
echo ""
echo "4️⃣  Verificar código:"
echo "   npm run lint"
echo ""
echo "📚 Documentação:"
echo "   - README.md - Visão geral"
echo "   - SETUP.md - Guia detalhado"
echo "   - DEVELOPER_GUIDE.md - Boas práticas"
echo "   - EXAMPLES.md - Exemplos de extensão"
echo ""
echo "Divirta-se! 💜"
