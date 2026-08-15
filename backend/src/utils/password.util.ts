import bcrypt from 'bcrypt';

// Jumlah salt rounds untuk pengacakan hash password (standar keamanan OWASP)
const SALT_ROUNDS = 10;

// Mengenkripsi password mentah menjadi hash bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Membandingkan password mentah dengan hash yang tersimpan di database
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
