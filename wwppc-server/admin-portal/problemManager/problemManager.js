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
    // parsing body of non-json will throw error, breaking error messages
    const problemData = await response.json();
    console.log(problemData);

    // clear out the existing table and put some headers in
    table.innerHTML = '<tr><th>UUID</th><th>Name</th><th>Author</th></tr>'

    for (const problems of problemData) {
        // table row
        let row = document.createElement("tr");

        // table data
        let problemName = document.createElement("td")
        let nameDiv = document.createElement("div");
        nameDiv.textContent = problems.name; // div content
        problemName.contentEditable = true; // td contenteditable
        nameDiv.className = "problemText"; // div class
        problemName.appendChild(nameDiv); // td -> div

        let problemLevel = document.createElement("td");
        let nameDiv2 = document.createElement("div");
        nameDiv2.textContent = problems.author;
        problemLevel.contentEditable = true;
        nameDiv2.className = "problemText";
        problemLevel.appendChild(nameDiv2);

        let problemText = document.createElement("td");
        let textarea = document.createElement("textarea");
        textarea.textContent = problems.content;
        problemText.contentEditable = true;
        textarea.className = "pTextArea";
        textarea.cols = 80; textarea.rows = 20;

        problemText.appendChild(textarea);

        let updateButtonData = document.createElement("td");
        let updateButton = document.createElement("button");
        updateButton.className = "updateButton";
        updateButton.textContent = "UPDATE"
        // on button click update everything
        // updateButton.onclick = console.log('CLICKED')
        updateButton.onclick = () => modify(problems.id, nameDiv.textContent, nameDiv2.textContent, textarea.textContent, problems.cases, problems.constraints, problems.hidden, problems.archived);
        updateButtonData.appendChild(updateButton)


        row.appendChild(problemName);
        row.appendChild(problemLevel);
        row.appendChild(problemText);
        row.appendChild(updateButtonData);

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