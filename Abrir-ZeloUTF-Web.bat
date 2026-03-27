@echo off
setlocal

set "APP_DIR=%~dp0web"
set "APP_URL=http://127.0.0.1:5173"

if not exist "%APP_DIR%\package.json" (
  echo Nao foi encontrado web\package.json
  pause
  exit /b 1
)

echo Iniciando ZeloUTF Web...
if not exist "%APP_DIR%\node_modules" (
  echo Instalando dependencias (primeira execucao)...
  call npm install --prefix "%APP_DIR%"
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

echo Abrindo servidor em nova janela...
start "ZeloUTF Web" cmd /k "npm run dev --prefix \"%APP_DIR%\" -- --host 127.0.0.1 --port 5173"

echo Aguardando servidor iniciar...
timeout /t 3 /nobreak > nul

echo Abrindo no navegador: %APP_URL%
start "" "%APP_URL%"

endlocal
