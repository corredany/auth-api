import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const hash = await bcrypt.hash('admin123', 10);

await prisma.usuario.upsert({
  where: { email: 'admin@santino.com' },
  update: {},
  create: {
    nombre: 'Administrador',
    email: 'admin@santino.com',
    contrasena: hash,
    rolId: 1,
  },
});

console.log('Usuario admin creado en auth_db (admin@santino.com / admin123)');
await prisma.$disconnect();
