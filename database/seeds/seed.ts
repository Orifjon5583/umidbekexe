import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Ma’lumotlar bazasini boshlang‘ich ma’lumotlar bilan to‘ldirish boshlandi...');

  // 1. Foydalanuvchilar
  const adminPass = await bcrypt.hash('Admin123!', 10);
  const teacherPass = await bcrypt.hash('Teacher123!', 10);
  const studentPass = await bcrypt.hash('Student123!', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      fullName: 'Bosh Administrator',
      username: 'admin',
      passwordHash: adminPass,
      role: 'admin',
      isActive: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      fullName: 'Rustam Qodirov',
      username: 'teacher1',
      passwordHash: teacherPass,
      role: 'teacher',
      isActive: true,
    },
  });

  const student1 = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      fullName: 'Alisher Omonov',
      username: 'student1',
      passwordHash: studentPass,
      role: 'student',
      isActive: true,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: {
      fullName: 'Jasur Bekmirzayev',
      username: 'student2',
      passwordHash: studentPass,
      role: 'student',
      isActive: true,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { username: 'student3' },
    update: {},
    create: {
      fullName: 'Madina Karimova',
      username: 'student3',
      passwordHash: studentPass,
      role: 'student',
      isActive: true,
    },
  });

  console.log('✓ Foydalanuvchilar yaratildi (admin, teacher1, student1, student2, student3)');

  // 2. Guruh
  const group = await prisma.group.upsert({
    where: { name: 'Guruh-101 (Python & C++)' },
    update: {},
    create: {
      name: 'Guruh-101 (Python & C++)',
    },
  });

  // Guruh a'zolari
  for (const s of [student1, student2, student3]) {
    await prisma.groupMember.upsert({
      where: {
        groupId_studentId: { groupId: group.id, studentId: s.id },
      },
      update: {},
      create: {
        groupId: group.id,
        studentId: s.id,
      },
    });
  }
  console.log('✓ Guruh va o‘quvchilar biriktirildi');

  // 3. Masalalar
  // Masala 1: Python A + B
  const problem1 = await prisma.problem.create({
    data: {
      title: 'Ikki son yig‘indisi',
      statement: 'Bitta qatorda probel bilan ajratilgan ikkita butun son A va B beriladi. Ularning yig‘indisini ekranga chiqaring.',
      inputDescription: 'Bitta qatorda ikkita butun son: -10^9 <= A, B <= 10^9',
      outputDescription: 'A va B sonlarining yig‘indisi',
      sampleInput: '5 7',
      sampleOutput: '12',
      language: 'python',
      difficulty: 'easy',
      timeLimitMs: 1500,
      memoryLimitMb: 64,
      createdBy: teacher.id,
      testCases: {
        create: [
          { inputData: '5 7', expectedOutput: '12', isHidden: false, orderIndex: 0 },
          { inputData: '10 20', expectedOutput: '30', isHidden: false, orderIndex: 1 },
          { inputData: '-5 5', expectedOutput: '0', isHidden: false, orderIndex: 2 },
          { inputData: '0 0', expectedOutput: '0', isHidden: true, orderIndex: 3 },
          { inputData: '-10 -25', expectedOutput: '-35', isHidden: true, orderIndex: 4 },
          { inputData: '100000 250000', expectedOutput: '350000', isHidden: true, orderIndex: 5 },
          { inputData: '999999999 1', expectedOutput: '1000000000', isHidden: true, orderIndex: 6 },
          { inputData: '-500 1200', expectedOutput: '700', isHidden: true, orderIndex: 7 },
          { inputData: '42 0', expectedOutput: '42', isHidden: true, orderIndex: 8 },
          { inputData: '12345 67890', expectedOutput: '80235', isHidden: true, orderIndex: 9 },
        ],
      },
    },
  });

  // Masala 2: Python Faktorial hisoblash
  const problem2 = await prisma.problem.create({
    data: {
      title: 'Faktorialni hisoblash',
      statement: 'N musbat butun soni berilgan. N faktorial (N!) qiymatini hisoblang. (0! = 1, N! = 1 * 2 * ... * N)',
      inputDescription: 'Bitta butun son N (0 <= N <= 15)',
      outputDescription: 'N faktorial qiymati',
      sampleInput: '5',
      sampleOutput: '120',
      language: 'python',
      difficulty: 'easy',
      timeLimitMs: 1500,
      memoryLimitMb: 64,
      createdBy: teacher.id,
      testCases: {
        create: [
          { inputData: '5', expectedOutput: '120', isHidden: false, orderIndex: 0 },
          { inputData: '0', expectedOutput: '1', isHidden: false, orderIndex: 1 },
          { inputData: '1', expectedOutput: '1', isHidden: false, orderIndex: 2 },
          { inputData: '3', expectedOutput: '6', isHidden: true, orderIndex: 3 },
          { inputData: '4', expectedOutput: '24', isHidden: true, orderIndex: 4 },
          { inputData: '6', expectedOutput: '720', isHidden: true, orderIndex: 5 },
          { inputData: '7', expectedOutput: '5040', isHidden: true, orderIndex: 6 },
          { inputData: '8', expectedOutput: '40320', isHidden: true, orderIndex: 7 },
          { inputData: '10', expectedOutput: '3628800', isHidden: true, orderIndex: 8 },
          { inputData: '12', expectedOutput: '479001600', isHidden: true, orderIndex: 9 },
        ],
      },
    },
  });

  // Masala 3: C++ Massivdagi eng katta element
  const problem3 = await prisma.problem.create({
    data: {
      title: 'Massivdagi maksimal element',
      statement: 'Birinchi qatorda N (massiv elementlari soni), ikkinchi qatorda probel bilan ajratilgan N ta butun son beriladi. Massivdagi eng katta elementni chiqaring.',
      inputDescription: 'Birinchi qatorda N (1 <= N <= 1000). Ikkinchi qatorda N ta butun son.',
      outputDescription: 'Eng katta element qiymati',
      sampleInput: "5\n3 7 2 9 4",
      sampleOutput: '9',
      language: 'cpp',
      difficulty: 'medium',
      timeLimitMs: 2000,
      memoryLimitMb: 128,
      createdBy: teacher.id,
      testCases: {
        create: [
          { inputData: "5\n3 7 2 9 4", expectedOutput: '9', isHidden: false, orderIndex: 0 },
          { inputData: "3\n-5 -2 -9", expectedOutput: '-2', isHidden: false, orderIndex: 1 },
          { inputData: "1\n100", expectedOutput: '100', isHidden: true, orderIndex: 2 },
          { inputData: "4\n0 0 0 0", expectedOutput: '0', isHidden: true, orderIndex: 3 },
          { inputData: "6\n1 5 10 20 15 2", expectedOutput: '20', isHidden: true, orderIndex: 4 },
          { inputData: "5\n99 12 43 88 101", expectedOutput: '101', isHidden: true, orderIndex: 5 },
          { inputData: "4\n-1000 500 -200 499", expectedOutput: '500', isHidden: true, orderIndex: 6 },
          { inputData: "7\n8 8 8 8 8 8 9", expectedOutput: '9', isHidden: true, orderIndex: 7 },
          { inputData: "5\n100 90 80 70 60", expectedOutput: '100', isHidden: true, orderIndex: 8 },
          { inputData: "6\n-1 -2 -3 -4 -5 0", expectedOutput: '0', isHidden: true, orderIndex: 9 },
        ],
      },
    },
  });

  console.log('✓ Masalalar va test keyslar yaratildi (10 tadan test)');

  // 4. Vazifa
  const now = new Date();
  const startsAt = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Kecha boshlangan
  const dueAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 kundan keyin

  const assignment = await prisma.assignment.create({
    data: {
      title: '1-vazifa: Algoritmik mashqlar (Python & C++)',
      description: 'Darsdan keyingi majburiy amaliy mashqlar. Har bir masalani diqqat bilan o‘qib, barcha testlardan o‘tishga harakat qiling.',
      groupId: group.id,
      startsAt,
      dueAt,
      status: 'published',
      createdBy: teacher.id,
      assignmentProblems: {
        create: [
          { problemId: problem1.id, orderIndex: 0 },
          { problemId: problem2.id, orderIndex: 1 },
          { problemId: problem3.id, orderIndex: 2 },
        ],
      },
    },
  });

  // O'quvchilarga biriktirish
  for (const s of [student1, student2, student3]) {
    await prisma.assignmentStudent.create({
      data: {
        assignmentId: assignment.id,
        studentId: s.id,
      },
    });
  }

  console.log('✓ Vazifa va masalalar biriktirildi');
  console.log('[Seed] Barcha boshlang‘ich ma’lumotlar muvaffaqiyatli yuklandi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
