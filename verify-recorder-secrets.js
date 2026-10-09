#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = __dirname;
const problems = [];
function lines(text){ return String(text || '').split(/\r?\n/).filter(Boolean); }
function git(args){
  try { return cp.execFileSync('git', args, {cwd:root, encoding:'utf8', stdio:['ignore','pipe','pipe']}); }
  catch (error) { return ''; }
}
const tracked = new Set(lines(git(['ls-files'])));
for (const file of tracked) {
  if (file === '.env' || file.startsWith('.loggy-private/') || file.startsWith('.loggy-recordings/')) {
    problems.push(`PRIVATE FILE IS TRACKED: ${file}`);
  }
}

const gitignore = path.join(root,'.gitignore');
const ignoreText = fs.existsSync(gitignore) ? fs.readFileSync(gitignore,'utf8') : '';
for (const required of ['.env','.loggy-private/','.loggy-recordings/']) {
  if (!lines(ignoreText).map(x=>x.trim()).includes(required)) problems.push(`.gitignore is missing: ${required}`);
}

// If a local .env exists, make sure its sensitive values were not accidentally
// copied into any tracked text source. Values never leave this machine.
const envPath = path.join(root,'.env');
if (fs.existsSync(envPath)) {
  const env = {};
  for (const raw of lines(fs.readFileSync(envPath,'utf8'))) {
    const m = raw.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || m[1].startsWith('#')) continue;
    let value=m[2];
    if ((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))) value=value.slice(1,-1);
    env[m[1]]=value;
  }
  const secretKeys=['GOOGLE_CLIENT_SECRET','LOGGY_TOKEN_ENCRYPTION_KEY'];
  const skipExt=new Set(['.png','.jpg','.jpeg','.gif','.webp','.zip','.pdf','.mp3','.wav','.mp4','.webm','.ico']);
  for (const key of secretKeys) {
    const value=String(env[key]||'');
    if (!value || /^YOUR_|^REPLACE_/i.test(value) || value.length < 8) continue;
    for (const rel of tracked) {
      if (rel === '.env') continue;
      const ext=path.extname(rel).toLowerCase();
      if(skipExt.has(ext)) continue;
      let text='';
      try { text=fs.readFileSync(path.join(root,rel),'utf8'); } catch { continue; }
      if(text.includes(value)) problems.push(`${key} VALUE APPEARS IN TRACKED FILE: ${rel}`);
    }
  }
}

if (problems.length) {
  console.error('\nLoggy recorder secret check FAILED:\n');
  for (const p of problems) console.error(`- ${p}`);
  console.error('\nDo not push until these are fixed. If a real Google client secret was ever pushed, rotate it in Google Cloud.');
  process.exit(1);
}
console.log('Loggy recorder secret check passed: no private recorder files are tracked and required ignores are present.');
