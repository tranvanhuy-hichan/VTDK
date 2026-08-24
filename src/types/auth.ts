export type UserRole = "CUSTOMER" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  role: UserRole;
  avatar?: string | null;
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface GoogleLoginDTO {
  credential?: string;
  email?: string;
  name?: string;
  avatar?: string;
  googleId?: string;
}
