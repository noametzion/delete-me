// import fetch from 'node-fetch';
import xlsx from 'xlsx';

// const url = "";
// const getData = async () => {
//     // TODO:
//     // 1) set time period
//     // 2) download data
//     const response = await fetch(url);
//     const body = await response.text();
//     console.log(body);
// };

const readFromFile = () => {

    var workbook = xlsx.readFile('./data/Pi20306632-from-2023-07-01-0100-to-2023-08-01-0000.xlsx');
    var sheet_name_list = workbook.SheetNames;
    // console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
    console.log(sheet_name_list);
}

export {readFromFile};