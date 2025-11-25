/* ============================================================
   view-db.js - Visualizador de Base de Datos
   ============================================================
   
   PROPÓSITO:
   Script de utilidad para ver todos los usuarios registrados
   y verificar que las contraseñas estén correctamente cifradas.
   
   USO:
   node view-db.js
   
   FUNCIONALIDADES:
   - Lista todos los usuarios con sus datos básicos
   - Muestra los primeros caracteres del hash de contraseña
   - Verifica que todas las contraseñas usen bcrypt ($2b$)
   - Alerta si hay contraseñas sin cifrar
   ============================================================ */

const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('\n=== USUARIOS EN LA BASE DE DATOS ===\n');

// ============================================================
// OBTENER TODOS LOS USUARIOS
// Consulta la base de datos y muestra información básica
// ============================================================
const users = db.prepare('SELECT id, name, email, password FROM users').all();

if (users.length === 0) {
    console.log('❌ No hay usuarios registrados en la base de datos\n');
} else {
    // Mostrar información de cada usuario
    users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nombre: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password Hash: ${user.password.substring(0, 60)}...`);

        // Verificar si la contraseña está cifrada con bcrypt
        // Los hashes de bcrypt siempre empiezan con "$2b$"
        console.log(`¿Es hash bcrypt?: ${user.password.startsWith('$2b$') ? '✅ SÍ - CIFRADO' : '❌ NO - TEXTO PLANO'}`);
        console.log('---');
    });

    console.log(`\nTotal de usuarios: ${users.length}`);
}

// ============================================================
// VERIFICACIÓN DE SEGURIDAD
// Comprueba que todas las contraseñas estén cifradas
// ============================================================
console.log('\n=== VERIFICACIÓN DE SEGURIDAD ===');
const unsecureUsers = users.filter(u => !u.password.startsWith('$2b$'));
if (unsecureUsers.length === 0) {
    console.log('✅ Todas las contraseñas están cifradas con bcrypt');
} else {
    console.log(`⚠️  ${unsecureUsers.length} usuario(s) con contraseñas sin cifrar`);
}
console.log('');

db.close();
