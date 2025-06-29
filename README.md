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



