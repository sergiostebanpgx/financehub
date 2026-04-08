import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";
import { defaultCategories } from "../src/lib/default-categories";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@gastospro.app";
  const demoPassword = "demo12345";
  const demoPasswordHash = await bcrypt.hash(demoPassword, 12);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Usuario Demo",
      passwordHash: demoPasswordHash,
    },
    create: {
      name: "Usuario Demo",
      email: demoEmail,
      passwordHash: demoPasswordHash,
    },
  });

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: demoUser.id,
          name: category.name,
        },
      },
      update: {
        color: category.color,
        icon: category.icon,
      },
      create: {
        ...category,
        userId: demoUser.id,
      },
    });
  }

  const salaryCategory = await prisma.category.findFirstOrThrow({
    where: { userId: demoUser.id, name: "Salario" },
  });
  const foodCategory = await prisma.category.findFirstOrThrow({
    where: { userId: demoUser.id, name: "Comida" },
  });
  const transportCategory = await prisma.category.findFirstOrThrow({
    where: { userId: demoUser.id, name: "Transporte" },
  });
  const housingCategory = await prisma.category.findFirstOrThrow({
    where: { userId: demoUser.id, name: "Vivienda" },
  });
  const funCategory = await prisma.category.findFirstOrThrow({
    where: { userId: demoUser.id, name: "Entretenimiento" },
  });

  const currentCount = await prisma.transaction.count({
    where: { userId: demoUser.id },
  });
  if (currentCount > 0) {
    return;
  }

  await prisma.transaction.createMany({
    data: [
      {
        type: "INCOME",
        amount: "7200000",
        description: "Pago mensual",
        date: subDays(new Date(), 20),
        categoryId: salaryCategory.id,
        userId: demoUser.id,
      },
      {
        type: "EXPENSE",
        amount: "190000",
        description: "Mercado semanal",
        date: subDays(new Date(), 15),
        categoryId: foodCategory.id,
        userId: demoUser.id,
      },
      {
        type: "EXPENSE",
        amount: "76000",
        description: "Uber y bus",
        date: subDays(new Date(), 13),
        categoryId: transportCategory.id,
        userId: demoUser.id,
      },
      {
        type: "EXPENSE",
        amount: "1800000",
        description: "Arriendo",
        date: subDays(new Date(), 10),
        categoryId: housingCategory.id,
        userId: demoUser.id,
      },
      {
        type: "EXPENSE",
        amount: "95000",
        description: "Cine",
        date: subDays(new Date(), 5),
        categoryId: funCategory.id,
        userId: demoUser.id,
      },
      {
        type: "INCOME",
        amount: "1400000",
        description: "Freelance landing page",
        date: subDays(new Date(), 2),
        categoryId: salaryCategory.id,
        userId: demoUser.id,
      },
    ],
  });

  console.log("Usuario demo listo:");
  console.log(`Email: ${demoEmail}`);
  console.log(`Contrasena: ${demoPassword}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

