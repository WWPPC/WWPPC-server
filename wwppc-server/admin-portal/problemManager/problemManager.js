import { socket, useServerConnection } from './ServerConnection';
import bodyParser from "body-parser";
import {AccountOpResult} from "../../src/database";
async function buh() {
    const response = await fetch('/admin/api/problemData')
    const problemData = await response.json();
    console.log(problemData);
    if(response.status !== 200) {
        console.info()
    } else {
        const problemTable = document.createElement("table");
        problemTable.style = "border-collapse:collapse; width:100%;";
        for(const contests of problemData.contest) {
            let row = document.createElement("tr");
            row.style = "border: 1px solid white; text-align: center;"

            for(const problems of contests) {
                let probl = document.createElement("th")
                probl.textContent = problems.problemName;

                row.appendChild(probl);
            }
            problemTable.appendChild(row);
        }
    }
}