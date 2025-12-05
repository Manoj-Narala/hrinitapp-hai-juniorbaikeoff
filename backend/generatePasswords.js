const bcrypt = require('bcryptjs');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function main() {
  console.log('Generating password hashes...\n');
  
  const po_password = 'po123456';
  const john_password = 'user123456';
  const sarah_password = 'user456';
  
  const po_hash = await generateHash(po_password);
  const john_hash = await generateHash(john_password);
  const sarah_hash = await generateHash(sarah_password);
  
  console.log('PO Account:');
  console.log('  Username: po_admin');
  console.log('  Password: ' + po_password);
  console.log('  Hash: ' + po_hash);
  console.log('');
  console.log('User Account - John:');
  console.log('  Username: john_user');
  console.log('  Password: ' + john_password);
  console.log('  Hash: ' + john_hash);
  console.log('');
  console.log('User Account - Sarah:');
  console.log('  Username: sarah_user');
  console.log('  Password: ' + sarah_password);
  console.log('  Hash: ' + sarah_hash);
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
      "password": john_hash,
      "role": "USER",
      "name": "John Smith",
      "email": "john@company.com",
      "createdAt": "2025-10-30T10:00:00.000Z"
    },
    {
      "id": "user-3",
      "username": "sarah_user",
      "password": sarah_hash,
      "role": "USER",
      "name": "Sarah Johnson",
      "email": "sarah@company.com",
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
