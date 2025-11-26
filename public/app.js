const { useState } = React;
const { Terminal, Loader2, AlertCircle, Shield } = lucide;

function NmapScanner() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scanTypes = {
    basic: '-sV',
    quick: '-T4 -F',
    intense: '-T4 -A -v',
    ping: '-sn',
    tcp: '-sT',
    udp: '-sU',
    os: '-O'
  };

  const handleScan = async () => {
    if (!target.trim()) {
      setError('Please enter a target IP or hostname');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('Starting scan...\n');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: target.trim(),
          options: scanTypes[scanType]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setOutput(data.output);
    } catch (err) {
      setError(err.message);
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8' },
    React.createElement('div', { className: 'max-w-6xl mx-auto' },
      React.createElement('div', { className: 'bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl border border-blue-500/20 overflow-hidden' },
        // Header
        React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-purple-600 p-6' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement(Shield, { className: 'w-8 h-8 text-white' }),
            React.createElement('h1', { className: 'text-3xl font-bold text-white' }, 'Nmap Web Scanner')
          ),
          React.createElement('p', { className: 'text-blue-100 mt-2' }, 'Network exploration and security auditing tool')
        ),
        
        // Content
        React.createElement('div', { className: 'p-6 space-y-6' },
          // Warning
          React.createElement('div', { className: 'bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3' },
            React.createElement(AlertCircle, { className: 'w-5 h-5 text-yellow-400 mt-0.5' }),
            React.createElement('div', { className: 'text-sm text-yellow-200' },
              React.createElement('strong', null, 'Legal Notice: '),
              'Only scan networks and systems you own or have explicit permission to test.'
            )
          ),
          
          // Target Input
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Target (IP or Hostname)'),
            React.createElement('input', {
              type: 'text',
              value: target,
              onChange: (e) => setTarget(e.target.value),
              placeholder: 'e.g., 192.168.1.1 or scanme.nmap.org',
              className: 'w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
              disabled: loading
            })
          ),
          
          // Scan Type
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Scan Type'),
            React.createElement('select', {
              value: scanType,
              onChange: (e) => setScanType(e.target.value),
              className: 'w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500',
              disabled: loading
            },
              React.createElement('option', { value: 'basic' }, 'Basic Scan (Version Detection)'),
              React.createElement('option', { value: 'quick' }, 'Quick Scan (Fast)'),
              React.createElement('option', { value: 'intense' }, 'Intense Scan (OS + Services)'),
              React.createElement('option', { value: 'ping' }, 'Ping Scan (Host Discovery)'),
              React.createElement('option', { value: 'tcp' }, 'TCP Connect Scan'),
              React.createElement('option', { value: 'udp' }, 'UDP Scan'),
              React.createElement('option', { value: 'os' }, 'OS Detection')
            )
          ),
          
          // Scan Button
          React.createElement('button', {
            onClick: handleScan,
            disabled: loading,
            className: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
          },
            loading ? 
              React.createElement(React.Fragment, null,
                React.createElement(Loader2, { className: 'w-5 h-5 animate-spin' }),
                'Scanning...'
              ) :
              React.createElement(React.Fragment, null,
                React.createElement(Terminal, { className: 'w-5 h-5' }),
                'Start Scan'
              )
          ),
          
          // Error
          error && React.createElement('div', { className: 'bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300' }, error),
          
          // Output
          output && React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' }, 'Scan Results'),
            React.createElement('div', { className: 'bg-black/40 border border-gray-700 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto max-h-96 overflow-y-auto' },
              React.createElement('pre', { className: 'whitespace-pre-wrap' }, output)
            )
          )
        )
      ),
      
      // Info Cards
      React.createElement('div', { className: 'grid md:grid-cols-3 gap-4 mt-6' },
        React.createElement('div', { className: 'bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700' },
          React.createElement('h3', { className: 'text-white font-semibold mb-2' }, 'Quick Scan'),
          React.createElement('p', { className: 'text-gray-400 text-sm' }, 'Fast scan of common ports')
        ),
        React.createElement('div', { className: 'bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700' },
          React.createElement('h3', { className: 'text-white font-semibold mb-2' }, 'Version Detection'),
          React.createElement('p', { className: 'text-gray-400 text-sm' }, 'Identify service versions')
        ),
        React.createElement('div', { className: 'bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700' },
          React.createElement('h3', { className: 'text-white font-semibold mb-2' }, 'OS Detection'),
          React.createElement('p', { className: 'text-gray-400 text-sm' }, 'Detect operating system')
        )
      )
    )
  );
}

// Add Lucide icons via CDN
const script = document.createElement('script');
script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
script.onload = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(NmapScanner));
};
document.head.appendChild(script);
