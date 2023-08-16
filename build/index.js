"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expc_data_reader_1 = require("./eapc-data/expc-data-reader");
const report_creator_1 = require("./eapc-data/report-creator");
const file_path = './data/Pi20306632-from-2023-06-01-0000-to-2023-06-30-2300.xlsx';
const getReport = () => {
    const info = (0, expc_data_reader_1.read_file_info)(file_path);
    const after_data_read = (data_logs) => {
        const report = (0, report_creator_1.create_report)(data_logs, info);
        console.log(report);
    };
    (0, expc_data_reader_1.read_file_data_logs)(file_path, after_data_read);
};
getReport();
