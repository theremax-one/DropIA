#!/usr/bin/env node

import { spawn } from 'child_process';

// Verificar que estamos en desarrollo
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Prisma Studio no debe ejecutarse en producción');
  process.exit(1);
}

console.log('🔧 Iniciando Prisma Studio en modo desarrollo...');
console.log('📊 URL: http://localhost:5556');
console.log('⚠️  Solo para administradores y desarrolladores');
console.log('🛑 Presiona Ctrl+C para detener\n');

// Ejecutar Prisma Studio
const studio = spawn('npx', ['prisma', 'studio', '--port', '5556'], {
  stdio: 'inherit',
  shell: true
});

studio.on('error', (error) => {
  console.error('❌ Error ejecutando Prisma Studio:', error);
  process.exit(1);
});

studio.on('close', (code) => {
  console.log(`\n🔚 Prisma Studio cerrado con código: ${code}`);
}); 