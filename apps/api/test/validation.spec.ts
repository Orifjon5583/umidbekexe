import { validateLogin, validateCreateUser, validateProblem } from '@codepractice/validation';

describe('CodePractice Validation & Business Logic Tests', () => {
  describe('Login Validation', () => {
    it('to‘g‘ri login va parol kiritilganda muvaffaqiyatli validatsiya qiladi', () => {
      const res = validateLogin({
        username: 'teacher1',
        password: 'Password123!',
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.username).toBe('teacher1');
    });

    it('qisqa foydalanuvchi nomi yoki parol uchun xatolik qaytaradi', () => {
      const res = validateLogin({
        username: 'ab',
        password: '123',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('User Creation Validation', () => {
    it('o‘quvchi yaratish parametrlarini to‘g‘ri tekshiradi', () => {
      const res = validateCreateUser({
        fullName: 'Rustam Rahimov',
        username: 'rustam_01',
        password: 'SecurePassword123',
        role: 'student',
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.role).toBe('student');
    });

    it('noto‘g‘ri rol berilganda xatolik beradi', () => {
      const res = validateCreateUser({
        fullName: 'Rustam Rahimov',
        username: 'rustam_01',
        password: 'SecurePassword123',
        role: 'super_hacker' as any,
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.field === 'role')).toBe(true);
    });
  });

  describe('Problem Creation Validation', () => {
    it('to‘g‘ri masalani tekshiradi', () => {
      const res = validateProblem({
        title: 'A + B Masalasi',
        statement: 'Berilgan ikkita sonning yig‘indisini toping.',
        language: 'python',
        difficulty: 'easy',
        timeLimitMs: 2000,
        memoryLimitMb: 128,
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.language).toBe('python');
    });

    it('shart matni juda qisqa bo‘lsa rad etadi', () => {
      const res = validateProblem({
        title: 'A + B',
        statement: 'Kichik',
        language: 'python',
        difficulty: 'easy',
      });
      expect(res.isValid).toBe(false);
    });
  });
});
