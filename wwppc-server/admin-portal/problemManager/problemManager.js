const table = document.getElementById("pTable");

async function load() {
    const response = await fetch('/admin/api/problemList');
    console.log('LOADED');
    // make sure to check status BEFORE parsing body
    if (response.status != 200) {
        // the request went wrong and processing should stop
        console.error('Response code ' + response.status);
        return;
    }
    const problemData = await response.json();
    console.log(problemData);

    // clear out the existing table and put some headers in
    table.innerHTML = '<tr><th width="360px">UUID</th><th width="300px">Name</th><th width="200px">Author</th><th width="150px">Constraints</th><th width="600px">Problem Statement</th><th>Hidden</th><th>Archived</th></tr>';

    for (const problem of problemData) {
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
        constraintsTime.type = 'text';
        constraintsTime.value = problem.constraints.time;
        const constraintsMemory = document.createElement('input');
        constraintsMemory.type = 'text';
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
        content.rows = 20;
        contentCell.appendChild(content);
        row.appendChild(contentCell);
        // checkboxes
        const hidden = createField('checkbox');
        hidden.checked = problem.hidden;
        const archived = createField('checkbox');
        archived.checked = problem.archived;

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
        hidden.addEventListener('input', onEdit);
        archived.addEventListener('input', onEdit);

        // write button
        const updateButtonCell = document.createElement('td');
        const updateButton = document.createElement('input');
        updateButton.type = 'button';
        updateButton.value = 'SAVE';
        updateButtonCell.appendChild(updateButton);
        const updateErrorMessage = document.createElement('div');
        updateButtonCell.appendChild(updateErrorMessage);
        updateButton.onclick = () => {
            const res = modify(id.value, name.value, author.value, content.value, { time: constraintsTime.value, memory: constraintsMemory.value }, hidden.checked, archived.checked);
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

async function modify(id, name, author, content, constraints, hidden, archived) {
    // logging input
    console.log('MODIFIED');

    // post request
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
            constraints: constraints,
            hidden: hidden,
            archived: archived
        })
    });
    return res.status;
}

window.addEventListener('load', load);