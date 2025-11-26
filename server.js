const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Validation function
function isValidTarget(target) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return ipRegex.test(target) || hostnameRegex.test(target);
}

// API endpoint for scanning
app.post('/api/scan', (req, res) => {
  const { target, options } = req.body;

  if (!target || !isValidTarget(target)) {
    return res.status(400).json({ error: 'Invalid target specified' });
  }

  const allowedOptions = ['-sV', '-T4 -F', '-T4 -A -v', '-sn', '-sT', '-sU', '-O'];
  if (!allowedOptions.includes(options)) {
    return res.status(400).json({ error: 'Invalid scan options' });
  }

  const command = `nmap ${options} ${target}`;
  
  exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ 
        error: 'Scan failed. Make sure nmap is installed and you have necessary permissions.',
        details: error.message 
      });
    }

    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }

    res.json({ 
      output: stdout || 'Scan completed but no output received',
      command: command
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  exec('nmap --version', (error, stdout) => {
    if (error) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Nmap is not installed or not accessible' 
      });
    }
    res.json({ 
      status: 'ok',
      nmapVersion: stdout.split('\n')[0]
    });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
