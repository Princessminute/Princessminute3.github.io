const KEY_USERS = 'haneul_users';

export function seedDefaultAdmin() {
  const users = getUsers();
  if (!users.find(u => u.email === 'admin@haneulskin.com')) {
    users.push({
      role: 'admin',
      nombres: 'Admin',
      apellidos: 'Haneul',
      email: 'admin@haneulskin.com',
      password: 'admin123', // demo sólo front; en backend será hash
      telefono: '999999999',
      direccion: ''
    });
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  }
}

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; } catch { return []; }
}
export function saveUsers(list) {
  localStorage.setItem(KEY_USERS, JSON.stringify(list));
}
