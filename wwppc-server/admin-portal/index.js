

const logsBlock = document.getElementById('logs');

async function loadLogs() {
    const response = await fetch('/admin/api/logs');
    if (response.status != 200) {
        // not good
        console.error('/admin/api/logs code ' + response.status);
        document.getElementById('lastRefresh').innerHTML = 'Could not fetch ' + response.status;
        return;
    }
    document.getElementById('lastRefresh').innerHTML = 'Last refresh ' + new Date();
    const logs = await response.text();
    logsBlock.value = logs;
    logsBlock.scrollTop = logsBlock.scrollHeight;
};

window.addEventListener('load', () => {
    loadLogs();
});

document.getElementById('refreshLogsButton').onclick = loadLogs;