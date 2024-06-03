const table = document.getElementById("pTable");

async function load() {
    const response = await fetch('/admin/api/problemList');
    if (response.status != 200) {
        // the request went wrong and processing should stop
        console.error('/admin/api/problemList code ' + response.status);
        table.innerHTML = 'Cannot view problems';
        return;
    }
    const problemData = await response.json();

    // clear out the existing table and put some headers in
    table.innerHTML = '<tr><th width="360px">UUID</th><th width="300px">Name</th><th width="200px">Author</th><th width="150px">Constraints</th><th width="600px">Problem Statement</th><th width="100px">Hidden</th><th width="100px">Archived</th><th width="150px">Save</th></tr>';

    // add row button
    const addButtonRow = document.createElement('tr');
    const addButtonCell = document.createElement('td');
    addButtonCell.colSpan = 8;
    const addButton = document.createElement('input');
    addButton.type = 'button';
    addButton.value = 'ADD ROW';
    addButton.style.width = '100%';
    addButton.onclick = () => {
        const row = createRow({ id: '', name: 'Name', author: 'Author', content: '', constraints: { time: 0, memory: 0 }, hidden: false, archived: false });
        row.scrollIntoView();
    };
    addButtonCell.appendChild(addButton);
    addButtonRow.appendChild(addButtonCell);
    table.appendChild(addButtonRow);

    for (const problem of problemData) {
        createRow(problem);
    }
}

function createRow(problem) {
    const row = document.createElement("tr");

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

    // id, name, and author
    const id = createField('text');
    id.value = problem.id;
    const name = createField('text');
    name.value = problem.name;
    const author = createField('text');
    author.value = problem.author;
    // constraints are fancy
    const constraintsCell = document.createElement('td');
    const constraintsTime = document.createElement('input');
    constraintsTime.type = 'number';
    constraintsTime.value = problem.constraints.time;
    const constraintsMemory = document.createElement('input');
    constraintsMemory.type = 'number';
    constraintsMemory.value = problem.constraints.memory;
    const constraintsTimeLabel = document.createElement('label');
    constraintsTimeLabel.innerText = 'Time (ms):';
    constraintsTimeLabel.appendChild(constraintsTime);
    const constraintsMemoryLabel = document.createElement('label');
    constraintsMemoryLabel.innerText = 'Mem (MB):';
    constraintsMemoryLabel.appendChild(constraintsMemory);
    constraintsCell.appendChild(constraintsTimeLabel);
    constraintsCell.appendChild(constraintsMemoryLabel);
    row.appendChild(constraintsCell);
    // content also fancy
    const contentCell = document.createElement('td');
    const content = document.createElement('textarea');
    content.style.resize = 'vertical';
    content.value = problem.content;
    content.style.width = '100%';
    content.rows = 10;
    contentCell.appendChild(content);
    row.appendChild(contentCell);

    // make the borders very obviously red when something is edited
    const onEdit = () => {
        row.classList.add('edited');
    };
    id.addEventListener('input', onEdit);
    name.addEventListener('input', onEdit);
    author.addEventListener('input', onEdit);
    constraintsTime.addEventListener('input', onEdit);
    constraintsMemory.addEventListener('input', onEdit);
    content.addEventListener('input', onEdit);

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
        const res = await modify(id.value, name.value, author.value, content.value, { time: Number(constraintsTime.value), memory: Number(constraintsMemory.value) });
        if (res == 200) {
            row.classList.remove('edited');
        } else {
            updateErrorMessage.innerText = 'Could not write: ' + res;
        }
    };
    row.appendChild(updateButtonCell);

    table.appendChild(row);

    return row;
}

async function modify(id, name, author, content, constraints) {
    const res = await fetch('/admin/api/problemData', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: name,
            author: author,
            content: content,
            constraints: constraints
        })
    });
    if (res.status != 200) console.error('/admin/api/problemData code ' + res.status);
    else load();

    return res.status;
}

window.addEventListener('load', load);