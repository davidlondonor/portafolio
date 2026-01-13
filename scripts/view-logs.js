const fs = require('fs').promises;
const path = require('path');

async function viewLogs(options = {}) {
  const { limit = 20, filter = null } = options;

  const now = new Date();
  const month = now.toISOString().slice(0, 7);
  const logFile = path.join(process.cwd(), 'logs', `access-${month}.json`);

  try {
    const content = await fs.readFile(logFile, 'utf8');
    const lines = content.split('\n').filter(Boolean);

    let logs = lines.map(line => JSON.parse(line));

    // Filtros
    if (filter === 'failed') {
      logs = logs.filter(l => !l.success);
    } else if (filter === 'success') {
      logs = logs.filter(l => l.success);
    } else if (filter === 'rate-limited') {
      logs = logs.filter(l => l.reason === 'rate_limit_exceeded');
    }

    // Últimos N
    logs = logs.slice(-limit);

    // Mostrar
    console.log('\n=== ACCESS LOGS ===\n');
    logs.forEach(log => {
      const icon = log.success ? '✅' : '❌';
      const time = new Date(log.timestamp).toLocaleString();
      const reason = log.reason ? ` (${log.reason})` : '';

      console.log(`${icon} ${time} | IP: ${log.ip} | ${log.success ? 'SUCCESS' : 'FAILED'}${reason}`);
    });

    // Estadísticas
    console.log('\n=== STATS ===');
    console.log(`Total entries: ${logs.length}`);
    console.log(`Successful: ${logs.filter(l => l.success).length}`);
    console.log(`Failed: ${logs.filter(l => !l.success).length}`);
    console.log(`Rate limited: ${logs.filter(l => l.reason === 'rate_limit_exceeded').length}`);
    console.log('');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No logs found for current month.');
    } else {
      console.error('Error reading logs:', error);
    }
  }
}

// Argumentos CLI
const args = process.argv.slice(2);
const options = {};

if (args.includes('--failed')) options.filter = 'failed';
if (args.includes('--success')) options.filter = 'success';
if (args.includes('--rate-limited')) options.filter = 'rate-limited';

const limitArg = args.find(a => a.startsWith('--limit='));
if (limitArg) options.limit = parseInt(limitArg.split('=')[1]);

viewLogs(options);
