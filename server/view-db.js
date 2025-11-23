const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('\n=== USUARIOS EN LA BASE DE DATOS ===\n');

const users = db.prepare('SELECT id, name, email, password FROM users').all();

if (users.length === 0) {
    console.log('❌ No hay usuarios registrados en la base de datos\n');
} else {
    users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nombre: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password Hash: ${user.password.substring(0, 60)}...`);
        console.log(`¿Es hash bcrypt?: ${user.password.startsWith('$2b$') ? '✅ SÍ - CIFRADO' : '❌ NO - TEXTO PLANO'}`);
        console.log('---');
    });

    console.log(`\nTotal de usuarios: ${users.length}`);
}

console.log('\n=== VERIFICACIÓN DE SEGURIDAD ===');
const unsecureUsers = users.filter(u => !u.password.startsWith('$2b$'));
if (unsecureUsers.length === 0) {
    console.log('✅ Todas las contraseñas están cifradas con bcrypt');
} else {
    console.log(`⚠️  ${unsecureUsers.length} usuario(s) con contraseñas sin cifrar`);
}
console.log('');

db.close();
