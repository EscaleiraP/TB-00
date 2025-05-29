
// goibniu_cleanse.js

import fs from 'fs';
import path from 'path';

const BASE = process.cwd();

const TO_DELETE = [
  'Projects',
  'Goibniu',
  'backend',
  'Vault_Certs',
  'Lineage_Trials',
  'Scrolls',
  'Sandbox',
  'System_Archive',
  'test-import.mjs',
  'test-ethers.cjs',
  'test-ethers.mjs',
  'test.mp3',
  'step_4_validation_tools.zip',
  'vault_certificate.pdf',
  'qrcode.png',
  'README.md',
  'IMPLEMENTATION_REPORT.md',
  'symbiosis_alignment.md',
  'guardian_protocol_v2.1_pantheon_update.md'
];

const npmPackagesToRemove = [
  'ethers',
  'dotenv',
  '@web3-storage/w3up-client',
  '@ipld/car',
  'web3.storage',
  'swagger-jsdoc',
  'swagger-ui-express'
];

const LOG_PATH = path.join(BASE, 'logs', `cleanse-${Date.now()}.log`);
fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
fs.writeFileSync(LOG_PATH, `🧼 GOIBNIU CLEANSE RITUAL STARTED\n\n`);

function log(msg) {
  console.log(msg);
  fs.appendFileSync(LOG_PATH, msg + '\n');
}

function deletePath(p) {
  const full = path.join(BASE, p);
  if (!fs.existsSync(full)) {
    log(`SKIPPED (not found): ${p}`);
    return;
  }

  try {
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) {
      fs.rmSync(full, { recursive: true });
      log(`🗂️  DELETED folder: ${p}`);
    } else {
      fs.unlinkSync(full);
      log(`📄 DELETED file: ${p}`);
    }
  } catch (err) {
    log(`❌ ERROR deleting ${p}: ${err.message}`);
  }
}

log(`Target paths to purge:\n${TO_DELETE.join('\n')}`);
log(`\n--- EXECUTION BEGINNING ---\n`);

for (const p of TO_DELETE) {
  deletePath(p);
}

log(`\n--- CLEANUP DONE ---\n`);

log(`To complete, run:\nnpm uninstall ${npmPackagesToRemove.join(' ')}`);
