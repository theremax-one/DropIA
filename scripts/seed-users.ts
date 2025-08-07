import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de usuarios...');

  // Crear usuarios de prueba
  const users = [
    {
      email: 'test@test.com',
      name: 'Usuario Test',
      password: '123456',
      isAdmin: true,
      isSeller: false,
    },
    {
      email: 'demo@demo.com',
      name: 'Usuario Demo',
      password: '123456',
      isAdmin: false,
      isSeller: true,
    },
    {
      email: 'usuario@ejemplo.com',
      name: 'Usuario Ejemplo',
      password: '123456',
      isAdmin: false,
      isSeller: false,
    },
  ];

  for (const userData of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`✅ Usuario ${userData.email} ya existe`);
        continue;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✅ Usuario creado: ${user.email} (${user.name})`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error);
    }
  }

  console.log('🎉 Seed de usuarios completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 