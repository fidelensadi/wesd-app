import { User, UserCredentials } from '../types/user';

interface UserData extends User {
  password: string;
}

export const users: UserData[] = [
  {
    email: 'paola@wesd.com',
    password: 'paola12345',
    name: 'Paola Ntumba',
    phone: '0842832684'
  },
  {
    email: 'mawete@wesd.com',
    password: 'mawete12345',
    name: 'Mujinga Mawete',
    phone: '0843992577'
  },
  {
    email: 'poupouna@wesd.com',
    password: 'poupouna12345',
    name: 'Poupouna Kyabelwa',
    phone: '0847229851'
  },
  {
    email: 'munganga@wesd.com',
    password: 'munganga12345',
    name: 'Munganga Ingrid',
    phone: '0847237544'
  }
];

export const authenticateUser = (credentials: UserCredentials): User | null => {
  const user = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};