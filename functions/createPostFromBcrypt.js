const bcrypt = require('bcrypt');
const crypto = require('crypto');

const bcryptHash = '$2a$10$GAZj28XjECp2FDVLp5v9fe7MUFvbEiQ/zb140Cv7y8J/52Cb8N5zq';

const input = 'your_password';

const sha512 = crypto.createHash('sha256');

sha512.update(input);

const hash = sha512.digest('hex');

// compare
bcrypt.compare(hash, bcryptHash, (err, res) => {
  console.log('equal', res);
});
