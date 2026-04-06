# WMLUP (Windows Mobile Legacy Update Project) Backend

Full emulation of the Windows Phone update service (FE3 + TLU), optimized for Raspberry Pi and other low-resource ARM devices.

## 📁 Project Structure

- **`fe3/`**: Node.js/Express server emulating the File-Exchange (FE3) update discovery service.
  - `routes/client.js`: Main SOAP endpoint handler.
  - `services/targeting.js`: Logic for matching updates to device model and version.
  - `services/soapBuilder.js`: SOAP XML response generator.
  - `data/updates.json`: Catalog of available update metadata and download links.
  - `utils/logger.js`: Lightweight request and error logger.
- **`tlu/`**: Nginx configuration for the Trusted Link Update (TLU) static file server.
- **`shared/config.json`**: Global configuration for URLs and ports.

---

## 🚀 Setup & Installation (Raspberry Pi / ARM)

### Prerequisites
1. **Node.js**: Install the latest LTS version.
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. **Nginx**: Install for serving CAB files.
   ```bash
   sudo apt-get update
   sudo apt-get install nginx
   ```

### ⚙️ FE3 Server Setup
1. Clone this repository to your device.
2. Navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```
3. Update `shared/config.json` with your server's domain/IP:
   ```json
   {
     "fe3_url": "https://your-domain.com",
     "tlu_url": "https://your-tlu-subdomain.com",
     "port": 3000
   }
   ```
4. Start the server:
   ```bash
   npm start
   ```

### ⚙️ TLU Server (Nginx) Setup
1. Copy `tlu/nginx.conf` to your Nginx configuration directory:
   ```bash
   sudo cp tlu/nginx.conf /etc/nginx/sites-available/wmlup-tlu
   sudo ln -s /etc/nginx/sites-available/wmlup-tlu /etc/nginx/sites-enabled/
   ```
2. Create the web root and copy update files:
   ```bash
   sudo mkdir -p /var/www/wmlup/tlu/updates
   # Copy CAB files to this directory
   ```
3. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🧠 How It Works

### 1. Update Discovery (FE3)
When a Windows Phone 8.1 or W10M device checks for updates, it sends a SOAP request to:
`POST /ClientWebService/client.asmx`

The FE3 server parses the device model (`x-device-model`) and OS version (`x-os-version`) from the headers (or SOAP body) and matches them against `fe3/data/updates.json`.

### 2. SOAP Response
The server responds with a SOAP 1.2 XML payload containing the matched update metadata and direct download URLs pointing to the TLU server.

### 3. CAB Download (TLU)
The device identifies the CAB URL and performs an HTTP GET request to the TLU (Nginx) server. Nginx handles the file delivery with support for range requests (resumable downloads).

---

## 🛠️ Adding New Updates

To add a new update to the system:
1. Place the `.cab` file in your TLU server's `updates` directory.
2. Add an entry to `fe3/data/updates.json`:
   ```json
   {
     "id": "UNIQUE-KB-ID",
     "title": "Update Name",
     "description": "Details about the update",
     "device": "RM-XXXX",
     "min_version": "Min OS Version",
     "max_version": "Max OS Version",
     "file": "filename.cab",
     "size": 1234567
   }
   ```
3. Restart the FE3 server for changes to take effect.

---

## 📜 License
(c) 2024 WMLUP Project. Licensed under MIT.
