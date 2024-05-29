const table = document.getElementById("pTable");

async function load() {
    console.log('Loaded')
    const response = await fetch('/admin/api/problemList');
    // make sure to check status BEFORE parsing body
    if (response.status != 200) {
        // the request went wrong and processing should stop
        console.error('Response code ' + response.status);
        return;
    }
    const problemData = await response.json();
    console.log(problemData);

    // clear out the existing table and put some headers in
    table.innerHTML = '<tr><th width="400px">UUID</th><th width="400px">Name</th><th width="400px">Author</th><th width="300px">Constraints</th><th width="600px">Problem Statement</th><th>Hidden</th><th>Archived</th></tr>';

    for (const problem of problemData) {
        // table row
        const row = document.createElement("tr");

        // table data
        // using inputs (css will auto style them to fit)

        // make a function so i dont have to copy paste my fingers off
        const createField = () => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.style.textAlign = 'center';
            cell.appendChild(input);
            row.appendChild(cell);
            return input;
        };

        // id, name, and author
        const id = createField();
        id.value = problem.id;
        const name = createField();
        name.value = problem.name;
        const author = createField();
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
        // content.addEventListener('input', onEdit);

        // write button
        const updateButtonCell = document.createElement('td');
        const updateButton = document.createElement('input');
        updateButton.type = 'button';
        updateButton.value = 'UPDATE';
        updateButtonCell.appendChild(updateButton);
        // on button click update everything
        // updateButton.onclick = console.log('CLICKED')
        updateButton.onclick = () => modify();
        row.appendChild(updateButtonCell);
        table.appendChild(row);
    }
}

function modify(id, name, author, content, testCases, constraints, hidden, archived) {
    // logging input
    console.log('MODIFIED');
    console.log(JSON.stringify({
        id: id,
        name: name,
        author: author,
        content: content,
        cases: testCases,
        constraints: constraints,
        hidden: hidden,
        archived: archived
    }));

    // post request
    fetch('/admin/api/problemData', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: name,
            author: author,
            content: content,
            cases: testCases,
            constraints: constraints,
            hidden: hidden,
            archived: archived
        })
    }).then((response) => response.json())
        .then((json) => console.log(json))
}

window.addEventListener('load', load);