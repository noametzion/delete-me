"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eapc_data_reader_1 = require("./eapc-data/eapc-data-reader");
const report_creator_1 = require("./eapc-data/report-creator");
const eapc_report_writer_1 = require("./eapc-data/eapc-report-writer");
const file_path = './data/Pi20306632-from-2023-06-01-0000-to-2023-06-30-2300.xlsx';
const report_example = {
    info: {
        prob_serial_number: 'Pi20306632',
        from_time: new Date(),
        to_time: new Date(),
    },
    thickness: {
        thickness_at_start: 499.71169727,
        thickness_at_end: 499.455170199,
        thickness_difference: 0.2565270709999936
    },
    ac_dc: {
        vac_max: 2.941810846,
        vac_min: 0.042286128,
        vac_avg: 0.3565404744924442,
        vac_time_above_limit: 0,
        ac_max: 15.530797243,
        ac_min: 0.222540069,
        ac_avg: 1.8719088672216668,
        ac_time_above_limit: 0,
        dc_max: -0.224870984,
        dc_min: -9.260758162,
        dc_avg: -3.2210358766927154,
        dc_time_above_limit: 0
    },
    eon_eoff: {
        eon_max: -1.040382862,
        eon_min: -3.017304897,
        eon_avg: -1.722543856220345,
        eon_time_above_limit: 0.03333333333333333,
        eon_eoff_diff_max: 2.001569271,
        eon_eoff_diff_min: 0.024647236000000072,
        eon_eoff_diff_time_below_limit: 0,
        eoff_max: -0.949369669,
        eoff_min: -1.081434727,
        eoff_avg: -1.0174329199649972,
        eoff_time_above_limit: 0
    }
};
const getReport = () => {
    const info = (0, eapc_data_reader_1.read_file_info)(file_path);
    const after_data_read = (data_logs) => {
        const report = (0, report_creator_1.create_report)(data_logs, info);
        console.log(report);
        (0, eapc_report_writer_1.create_report_file)(report_example, "test.xlsx");
    };
    (0, eapc_data_reader_1.read_file_data_logs)(file_path, after_data_read);
};
getReport();
