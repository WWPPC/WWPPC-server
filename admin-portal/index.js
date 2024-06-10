

const logsBlock = document.getElementById('logs');

async function loadLogs() {
    const response = await fetch('/admin/api/logs');
    if (response.status != 200) {
        // not good
        console.error('/admin/api/logs code ' + response.status);
        document.getElementById('lastRefresh').innerHTML = 'Could not fetch ' + response.status;
        return;
    }
    document.getElementById('lastRefresh').innerHTML = 'Last refresh ' + new Date().toLocaleString();
    const logs = await response.text();
    logsBlock.value = logs;
    logsBlock.scrollTop = logsBlock.scrollHeight;
};

const table = document.getElementById('aTable');

async function loadAdmins() {
    const response = await fetch('/admin/api/admins');
    if (response.status != 200) {
        // the request went wrong and processing should stop
        console.error('/admin/api/admins code ' + response.status);
        table.innerHTML = 'Cannot view admins';
        return;
    }
    const admins = await response.json();

    // clear out admins
    sAdmins.length = 0;
    table.innerHTML = '<tr><th width="200px">Username</th><th width="100px">Admin</th><th width="100px">Manage Accounts</th><th width="100px">Manage Problems</th><th width="100px">Manage Contests</th><th width="100px">Manage Submissions</th><th width="100px">Manage Admins</th></tr>';

    // save all admins
    const saveButtonRow = document.createElement('tr');
    const saveButtonCell = document.createElement('td');
    saveButtonCell.colSpan = 7;
    const saveButton = document.createElement('input');
    saveButton.type = 'button';
    saveButton.value = 'SAVE';
    saveButton.style.width = '100%';
    saveButton.onclick = async () => {
        const res = await modify();
        if (res != 200) saveError.innerText = 'Could not write: ' + res;
        else saveError.innerText = '';
    };
    const saveError = document.createElement('div');
    saveButtonCell.appendChild(saveButton);
    saveButtonCell.appendChild(saveError);
    saveButtonRow.appendChild(saveButtonCell);
    table.insertBefore(saveButtonRow, table.children[0]);

    // add row button
    const addButtonRow = document.createElement('tr');
    const addButtonCell = document.createElement('td');
    addButtonCell.colSpan = 7;
    const addButton = document.createElement('input');
    addButton.type = 'button';
    addButton.value = 'ADD ROW';
    addButton.style.width = '100%';
    addButton.onclick = () => {
        const row = createRow({ username: '', permissions: 0 });
        row.scrollIntoView();
    };
    addButtonCell.appendChild(addButton);
    addButtonRow.appendChild(addButtonCell);
    table.insertBefore(addButtonRow, table.children[0]);

    for (const admin of admins) {
        createRow(admin);
    }
}

const sAdmins = [];
function createRow(admin) {
    const row = document.createElement("tr");

    const createField = (type) => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = type;
        input.style.textAlign = 'center';
        cell.appendChild(input);
        row.appendChild(cell);
        return input;
    };

    const username = createField('text');
    username.value = admin.username;
    const isAdmin = createField('checkbox');
    isAdmin.checked = (admin.permissions & 1) != 0;
    const manageAccounts = createField('checkbox');
    manageAccounts.checked = (admin.permissions & (1 << 1)) != 0;
    const manageProblems = createField('checkbox');
    manageProblems.checked = (admin.permissions & (1 << 2)) != 0;
    const manageContests = createField('checkbox');
    manageContests.checked = (admin.permissions & (1 << 3)) != 0;
    const manageSubmissions = createField('checkbox');
    manageSubmissions.checked = (admin.permissions & (1 << 4)) != 0;
    const manageAdmins = createField('checkbox');
    manageAdmins.checked = (admin.permissions & (1 << 30)) != 0;

    // make the borders very obviously red when something is edited
    // have ot write all admins at same time so do the thing
    const saveAdmin = {
        username: username.value,
        permissions: isAdmin.checked | (manageAccounts.checked << 1) | (manageProblems.checked << 2) | (manageContests.checked << 3) | (manageSubmissions.checked << 4) | (manageAdmins.checked << 30)
    };
    const onEdit = () => {
        row.classList.add('edited');
        saveAdmin.username = username.value;
        saveAdmin.permissions = isAdmin.checked | (manageAccounts.checked << 1) | (manageProblems.checked << 2) | (manageContests.checked << 3) | (manageSubmissions.checked << 4) | (manageAdmins.checked << 30)
    };
    username.addEventListener('input', onEdit);
    isAdmin.addEventListener('input', onEdit);
    manageAccounts.addEventListener('input', onEdit);
    manageProblems.addEventListener('input', onEdit);
    manageContests.addEventListener('input', onEdit);
    manageSubmissions.addEventListener('input', onEdit);
    manageAdmins.addEventListener('input', onEdit);

    table.appendChild(row);

    sAdmins.push(saveAdmin);

    return row;
}

async function modify() {
    const res = await fetch('/admin/api/admins', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            admins: sAdmins
        })
    });
    if (res.status != 200) console.error('/admin/api/admins code ' + res.status);
    else loadAdmins();

    return res.status;
}

window.addEventListener('load', () => {
    loadAdmins();
    loadLogs();
    setInterval(() => {
        // dont autoscroll to bottom
        const rect = logsBlock.getBoundingClientRect();
        if (logsBlock.scrollTop >= logsBlock.scrollHeight - rect.height - 2) loadLogs();
    }, 10000);
});

document.getElementById('refreshLogsButton').onclick = loadLogs;