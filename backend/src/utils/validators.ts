export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Minimal 6 karakter
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  // Minimal 3 karakter, hanya huruf, angka, dan underscore
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};
