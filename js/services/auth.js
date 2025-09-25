import { getUsers, saveUsers, seedDefaultAdmin } from './storage.js';
import { state } from '../state.js';

seedDefaultAdmin();

export function login(email, password) {
  const u = getUsers().find(x => x.email === email && x.password === password);
  if (!u) return null;
  state.user = { role: u.role, nombre: u.nombres, email: u.email };
  state.save();
  return state.user;
}

export function logout() {
  state.user = null;
  state.save();
}

export function registerClient(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    throw new Error('El email ya está registrado');
  }
  users.push({
    role: 'cliente',
    nombres: data.nombres,
    apellidos: data.apellidos,
    email: data.email,
    password: data.password,
    telefono: data.telefono,
    direccion: data.direccion || ''
  });
  saveUsers(users);
  return true;
}

export function listUsers() {
  return getUsers();
}
