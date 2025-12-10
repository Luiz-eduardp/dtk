@echo off
REM DTK Quick Start Script for Windows

echo.
echo 🚀 DTK - Quick Setup
echo ===================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Instale em: https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Instalando dependencias...
call npm install

echo.
echo ✅ Setup completo!
echo.
echo 📋 Proximos passos:
echo.
echo 1️⃣  Iniciar desenvolvimento:
echo    npm run dev
echo.
echo 2️⃣  Build para producao:
echo    npm run build
echo.
echo 3️⃣  Empacotar aplicacao:
echo    npm run package
echo.
echo 4️⃣  Verificar codigo:
echo    npm run lint
echo.
echo 📚 Documentacao:
echo    - README.md - Visao geral
echo    - SETUP.md - Guia detalhado
echo    - DEVELOPER_GUIDE.md - Boas praticas
echo    - EXAMPLES.md - Exemplos de extensao
echo.
echo Divirta-se! 💜
