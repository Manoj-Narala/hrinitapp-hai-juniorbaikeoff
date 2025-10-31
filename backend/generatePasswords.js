const bcrypt = require('bcryptjs');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function main() {
  console.log('Generating password hashes...\n');
  
  const po_password = 'po123456';
  const user_password = 'user123456';
  
  const po_hash = await generateHash(po_password);
  const user_hash = await generateHash(user_password);
  
  console.log('PO Account:');
  console.log('  Username: po_admin');
  console.log('  Password: ' + po_password);
  console.log('  Hash: ' + po_hash);
  console.log('');
  console.log('User Account:');
  console.log('  Username: john_user');
  console.log('  Password: ' + user_password);
  console.log('  Hash: ' + user_hash);
  console.log('');
  
  // Create users array
  const users = [
    {
      "id": "user-1",
      "username": "po_admin",
      "password": po_hash,
      "role": "PO",
      "name": "Product Owner",
      "email": "po@company.com",
      "createdAt": "2025-10-30T10:00:00.000Z"
    },
    {
      "id": "user-2",
      "username": "john_user",
      "password": user_hash,
      "role": "USER",
      "name": "John Smith",
      "email": "john@company.com",
      "createdAt": "2025-10-30T10:00:00.000Z"
    }
  ];
  
  const fs = require('fs');
  const path = require('path');
  const usersFile = path.join(__dirname, '..', 'data', 'users.json');
  
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  console.log('✅ users.json file updated successfully!');
}

main();
