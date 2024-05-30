const table = document.getElementById("pTable");

async function load() {
    const response = await fetch('/admin/api/accountList');
    if (response.status != 200) {
        // the request went wrong and processing should stop
        console.error('/admin/api/accountList code ' + response.status);
        table.innerHTML = 'Cannot view accounts';
        return;
    }
    const accounts = await response.json();

    // clear out the existing table and put some headers in
    table.innerHTML = '<tr><th width="360px">username</th><th width="100px"></th></tr>';
    // <th width="100px"></th>

    for (const account of accounts) {
        // table row
        const row = document.createElement("tr");

        // table data
        // using inputs (css will auto style them to fit)

        // make a function so i dont have to copy paste my fingers off
        const createField = (type) => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = type;
            input.style.textAlign = 'center';
            cell.appendChild(input);
            row.appendChild(cell);
            return input;
        };

        // id
        const id = createField('text');
        id.value = account.id;
        // profile image actually is image? can upload image instead of manual copy paste data

        // team data editing needs to be in a popup thing
        // make button that slides out a window for editing team data separately

        // make the borders very obviously red when something is edited
        const onEdit = () => {
            row.classList.add('edited');
        };
        id.addEventListener('input', onEdit);

        // write button
        const updateButtonCell = document.createElement('td');
        const updateButton = document.createElement('input');
        updateButton.type = 'button';
        updateButton.value = 'SAVE';
        updateButton.style.width = '100%';
        updateButtonCell.appendChild(updateButton);
        const updateErrorMessage = document.createElement('div');
        updateButtonCell.appendChild(updateErrorMessage);
        updateButton.onclick = async () => {
            const res = await modify(id.value);
            if (res == 200) {
                row.classList.remove('edited');
            } else {
                updateErrorMessage.innerText = 'Could not write: ' + res;
            }
        };
        row.appendChild(updateButtonCell);

        table.appendChild(row);
    }
}

async function modify(id) {
    const res = await fetch('/admin/api/asdf', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    });
    if (res.status != 200) console.error('/admin/api/asdf code ' + res.status);

    load();

    return res.status;
}

window.addEventListener('load', load);