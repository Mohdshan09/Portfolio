// Usage: npm run hash-password -w server
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in server/.env.
// Deliberately doesn't import config/env, so it works before .env is complete.
import { createInterface } from 'node:readline/promises';
import bcrypt from 'bcryptjs';

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question('Admin password (min 12 chars): ');
  rl.close();

  if (password.length < 12) {
    console.error('Too short — use at least 12 characters.');
    process.exit(1);
  }

  console.log(`\nADMIN_PASSWORD_HASH=${await bcrypt.hash(password, 12)}`);
}

void main();
