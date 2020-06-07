export function exportCSV(urlForCsv, getTableName, getCountyName, getYear, getColumn) {

    const objectToCsv = function(data) {
        //get the  HEADERS
        const csvRows = [] //array pt ca o sa am multe randuri tip csv
        const headers = Object.keys(data[0]); //aici iau cheia obiectului(si primul element din data)
        csvRows.push(headers.join(',')) //prima oara pun headers, separate de virgula(ca-i csv)

        //loop over the rows
        for (const row of data) { //parcurg fiecare rand 
            const values = headers.map(header => { //add the data to object
                const escaped = ('' + row[header]).replace(/"/g, '\\"') //din number il fac string
                    //pun ghilimele ca sa evit ca un element din csv-ul meu sa aiba el o virgula care nu apartine de csv
                return `"${escaped}"`
            })
            csvRows.push(values.join(',')) // pun virgula intre valorile de pe un rand
        }
        //form csv

        return csvRows.join('\n')
    };


    const download = function(data) {
        const blob = new Blob([data], { type: 'text/csv' }) //cu blob pot downloada
        const url = window.URL.createObjectURL(blob); //trimit blob catre browser.imi da posiibilitatea sa fac un url dintr-un object(csv)
        const a = document.createElement('a'); //a tag pt click
        a.setAttribute('hidden', '')
        a.setAttribute('href', url) //unde sa trimit 
        a.setAttribute('download', `${getTableName}_${getCountyName}_${getYear}.csv`)
        document.body.appendChild(a) //inainte sa dau click
        a.click();
        document.body.removeChild(a) //dupa ce dau click
    }

    const getReport = async function() {

        console.log("urlForCsv = " + urlForCsv)
        const res = await fetch(urlForCsv) //fetch- metoda browserului de a lua data.  fetch returneaza o promisiune
        const json = await res.json() //cu aceasta linie pot lua si datele, nu doar headers....
        console.log(json)

        console.log(getColumn);
        const data = json.map(row => ({ //mapez ca sa imi puna in csv doar ce vreau, nu tot
            month: row.month,
            year: row.year,
            [getColumn]: row[getColumn]


        }));
        const csvData = objectToCsv(data) //apelez functia de mai sus
        download(csvData)

        console.log("DATA:");
        console.log(data);

    }

    getReport();

}
export function exportSVG(getTableName, getCountyName, getYear, numarDiagrame) {
    let svg;
    if (numarDiagrame == 1)
        svg = document.querySelector('#diagram svg');
    else
        svg = document.querySelector('#diagram2 svg');
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const a = document.createElement('a');
    const e = new MouseEvent('click');
    a.download = `${getTableName}_${getCountyName}_${getYear}.svg`
    a.href = 'data:image/svg+xml;base64,' + base64doc;
    a.dispatchEvent(e);

}

export function exportPDF(urlForPdf, getTableName, getCountyName, getYear, getColumn) {

    const download = function(data) {
        const blob = new Blob([data], { type: 'text/csv' }) //cu blob pot downloada
        const url = window.URL.createObjectURL(blob); //trimit blob catre browser.imi da posiibilitatea sa fac un url dintr-un object(csv)
        const a = document.createElement('a'); //a tag pt click
        a.setAttribute('hidden', '')
        a.setAttribute('href', url) //unde sa trimit 
        a.setAttribute('download', `${getTableName}_${getCountyName}_${getYear}.csv`)
        document.body.appendChild(a) //inainte sa dau click
        a.click();
        document.body.removeChild(a) //dupa ce dau click
    }

    const getReport = async function() {
        console.log("urlForPdf = " + urlForPdf)
        const res = await fetch(urlForPdf) //fetch- metoda browserului de a lua data.  fetch returneaza o promisiune
        const json = await res.json() //cu aceasta linie pot lua si datele, nu doar headers....
        console.log("JSON = " + json)

        console.log("getColumn = " + getColumn);
        const data = json.map(row => ({ //mapez ca sa imi puna in csv doar ce vreau, nu tot
            month: row.month,
            year: row.year,
            [getColumn]: row[getColumn]
        }));
        //const csvData = objectToCsv(data) //apelez functia de mai sus
        //download(csvData)

        console.log("DATA:");
        console.log(data);

        var doc = new jsPDF();
        data.forEach(function(employee, i) {
            doc.text(20, 10 + (i * 10),
                "Month: " + employee.month + " " +
                "Year: " + employee.year + ": " + [getColumn] + ": " + employee[getColumn]);
        });
        doc.save(`${getTableName}_${getCountyName}_${getYear}.pdf`);

    }
    getReport();
}