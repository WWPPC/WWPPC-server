async function load() {
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
    const problemTable = document.createElement("table");
    problemTable.style = "border-collapse:collapse; width:100%;";
    for (const contests of problemData.contest) {
        let row = document.createElement("tr");
        row.style = "border: 1px solid white; text-align: center;"

        for (const problems of contests) {
            let probl = document.createElement("th")
            probl.textContent = problems.problemName;

            row.appendChild(probl);
        }
        problemTable.appendChild(row);
    }
}

window.addEventListener('load', load);