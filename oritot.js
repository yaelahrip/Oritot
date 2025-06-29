// index.js
require('dotenv').config();
const { program } = require('commander');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

// CLI Options
program
  .name('origin-ip-finder')
  .description('Find the real origin IP behind a CDN/WAF-protected domain')
  .requiredOption('-d, --domain <domain>', 'Target domain')
  .option('--verify', 'Verify IP with SSL cert via Nmap')
  .parse();

const { domain, verify } = program.opts();

// Safe exec wrapper
const runCommand = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) return reject(stderr);
    resolve(stdout.trim());
  });
});

// Detect WAF via wafw00f
async function detectWAF(domain) {
  try {
    const output = await runCommand(`wafw00f https://${domain}`);
    console.log('[+] WAF Detection:\n', output);
  } catch (err) {
    console.error('[-] WAF detection failed:', err);
  }
}

// Detect technologies via Wappalyzer
async function detectTech(domain) {
  try {
    const res = await axios.get(`https://api.wappalyzer.com/v2/lookup/?urls=https://${domain}`,
      { headers: { 'x-api-key': process.env.WAPPALYZER_API_KEY } });
    console.log('[+] Wappalyzer Tech Stack:', res.data[0]?.technologies?.map(t => t.name).join(', '));
  } catch (err) {
    console.error('[-] Wappalyzer failed:', err.message);
  }
}

// DNS History via ViewDNS
async function fetchDNSHistory(domain) {
  try {
    const res = await axios.get(`https://api.viewdns.info/dnsrecord/?domain=${domain}&recordtype=A&apikey=${process.env.VIEWDNS_API_KEY}&output=json`);
    const records = res.data.response?.records || [];
    console.log('[+] ViewDNS History:', records.map(r => r.value).join(', '));
  } catch (err) {
    console.error('[-] ViewDNS failed:', err.message);
  }
}

// Favicon hash calculation
async function getFaviconHash(domain) {
  try {
    const res = await axios.get(`https://${domain}/favicon.ico`, { responseType: 'arraybuffer' });
    const b64 = Buffer.from(res.data).toString('base64');
    const hash = mmh3(b64);
    console.log(`[+] Favicon mmh3 hash: ${hash}`);
    return hash;
  } catch (err) {
    console.error('[-] Favicon fetch failed:', err.message);
    return null;
  }
}

function mmh3(base64) {
  const buf = Buffer.from(base64);
  let h = 0;
  for (let i = 0; i < buf.length; i++) {
    h = Math.imul(h ^ buf[i], 0x5bd1e995);
    h ^= h >>> 15;
  }
  return h >>> 0;
}

// Shodan search by favicon hash
async function searchShodan(hash) {
  try {
    const res = await axios.get(`https://api.shodan.io/shodan/host/search`, {
      params: {
        key: process.env.SHODAN_API_KEY,
        query: `http.favicon.hash:${hash}`
      }
    });
    console.log('[+] Shodan IPs:', res.data.matches.map(m => m.ip_str).join(', '));
  } catch (err) {
    console.error('[-] Shodan search failed:', err.message);
  }
}

// Optional: verify with Nmap
async function verifyWithNmap(ip) {
  if (!verify) return;
  try {
    const out = await runCommand(`nmap --script ssl-cert -p 443 ${ip}`);
    console.log(`[✓] SSL Cert info for ${ip}:
${out}`);
  } catch (err) {
    console.error('[-] Nmap verification failed:', err);
  }
}

(async () => {
  console.log(`[~] Scanning domain: ${domain}`);
  await detectWAF(domain);
  await detectTech(domain);
  await fetchDNSHistory(domain);

  const hash = await getFaviconHash(domain);
  if (hash) await searchShodan(hash);

  // Example: verify an IP if known manually (demo purpose)
  if (verify) await verifyWithNmap('1.2.3.4');
})();
