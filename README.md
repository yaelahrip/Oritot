# 🕵️ Origin IP Finder - Bypass CDN/WAF with Node.js

This open-source tool helps **bug bounty hunters**, **red teamers**, and **cybersecurity researchers** discover the **origin IP address** behind targets protected by CDNs and WAFs (e.g., Cloudflare, Akamai, etc.).

> Designed for **educational** and **authorized security testing** only.

---

## 📦 Features

- 🌐 Detect CDN/WAF provider (via wafw00f & Wappalyzer)
- 🧠 Extract DNS history (ViewDNS & SecurityTrails)
- 🎯 Discover servers using the same favicon (via Shodan hash search)
- 🔍 Match SSL certificate CNs (via Censys)
- 🛡 Check SPF, MX, and A records for clues
- ✅ Verify real server IP using `/etc/hosts` and Nmap

---


## 🔧 Installation

### 1. Clone the Project
```bash
git clone https://github.com/your-username/origin-ip-finder.git
cd origin-ip-finder
```

### 2. Install Dependencies
```bash
npm install
```

> Requires Node.js v16 or later

### 3. Install `wafw00f`
```bash
pip install wafw00f
```

---

## 🔐 .env Configuration

Create a `.env` file in the project root:

```env
# Wappalyzer API Key
WAPPALYZER_API_KEY=your_wappalyzer_api_key

# ViewDNS API Key
VIEWDNS_API_KEY=your_viewdns_api_key

# Shodan API Key
SHODAN_API_KEY=your_shodan_api_key
```

> 🔑 You can get free-tier API keys from:
> - https://www.wappalyzer.com/api/
> - https://viewdns.info/api/
> - https://shodan.io/account

---

## 🚀 Usage

### Basic Usage:
```bash
node index.js -d example.com
```

### With SSL Certificate Verification:
```bash
node index.js -d example.com --verify
```

---

## 📌 Example Output
```bash
[~] Scanning domain: example.com
[+] WAF Detection:
  Is behind Cloudflare

[+] Wappalyzer Tech Stack: Nginx, Google Analytics

[+] ViewDNS History: 104.21.44.123, 172.67.218.45

[+] Favicon mmh3 hash: 123456789
[+] Shodan IPs: 104.21.44.123, 192.0.2.1

[✓] SSL Cert info for 1.2.3.4:
Subject CN: example.com
```

---

## 📚 For Educational Purposes Only

This tool is intended **only for educational and lawful use**, such as:
- Security research
- Bug bounty hunting on authorized programs
- CTFs and red team simulation

Using this tool against unauthorized targets **may violate laws**. Always get **explicit permission** before testing.

---

## 🪪 License

MIT License © 2025 [yaelahrip] natnetnot

See the full `LICENSE` file for details.
