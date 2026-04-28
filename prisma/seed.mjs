import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rolAdmin = await prisma.rol.upsert({ where: { nombre: 'admin' }, update: {}, create: { nombre: 'admin' } });
await prisma.rol.upsert({ where: { nombre: 'editor' }, update: {}, create: { nombre: 'editor' } });
await prisma.rol.upsert({ where: { nombre: 'recepcionista' }, update: {}, create: { nombre: 'recepcionista' } });

const hash = await bcrypt.hash('admin123', 10);

await prisma.usuario.upsert({
  where: { email: 'admin@santino.com' },
  update: {},
  create: {
    nombre: 'Administrador',
    email: 'admin@santino.com',
    contrasena: hash,
    rolId: rolAdmin.id,
  },
});

console.log('Roles y usuario admin creados en auth_db (admin@santino.com / admin123)');
await prisma.$disconnect();
