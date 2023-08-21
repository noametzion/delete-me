"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_report_file = void 0;
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const XlsxPopulate = require('xlsx-populate');
const report_template_path = './template/report_template.xlsx';
const reports_path = './reports/';
const report_sheet_name = "Sheet1";
const edit_report = (report, report_file_path) => __awaiter(void 0, void 0, void 0, function* () {
    XlsxPopulate.fromFileAsync(report_file_path).then((workbook) => {
        // Edit info
        const from_time = (0, moment_1.default)(report.info.from_time).format("DD/MM/yyyy hh:mm");
        const to_time = (0, moment_1.default)(report.info.to_time).format("DD/MM/yyyy hh:mm");
        workbook.sheet(report_sheet_name).cell("C10").value(`${from_time} - ${to_time}`);
        workbook.sheet(report_sheet_name).cell("C14").value(`${report.info.prob_serial_number}`);
        // Edit thickness
        workbook.sheet(report_sheet_name).cell("C16").value(`${report.thickness.thickness_at_start.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F16").value(`${report.thickness.thickness_at_end.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C17").value(`${report.thickness.thickness_difference.toFixed(2)}`);
        // Edit eon eoff
        workbook.sheet(report_sheet_name).cell("C19").value(`${report.eon_eoff.eoff_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F19").value(`${report.eon_eoff.eoff_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C20").value(`${report.eon_eoff.eoff_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F20").value(`${report.eon_eoff.eoff_time_above_limit.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C22").value(`${report.eon_eoff.eon_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F22").value(`${report.eon_eoff.eon_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C23").value(`${report.eon_eoff.eon_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F23").value(`${report.eon_eoff.eon_time_above_limit.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C25").value(`${report.eon_eoff.eon_eoff_diff_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F25").value(`${report.eon_eoff.eon_eoff_diff_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C26").value(`${report.eon_eoff.eon_eoff_diff_time_below_limit.toFixed(2)}`);
        // Edit ac dc
        workbook.sheet(report_sheet_name).cell("C28").value(`${report.ac_dc.dc_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F28").value(`${report.ac_dc.dc_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C29").value(`${report.ac_dc.dc_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F29").value(`${report.ac_dc.dc_time_above_limit.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C31").value(`${report.ac_dc.vac_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F31").value(`${report.ac_dc.vac_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C32").value(`${report.ac_dc.vac_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F32").value(`${report.ac_dc.vac_time_above_limit.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C34").value(`${report.ac_dc.ac_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F34").value(`${report.ac_dc.ac_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C35").value(`${report.ac_dc.ac_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F35").value(`${report.ac_dc.ac_time_above_limit.toFixed(2)}`);
        // Write to file.
        return workbook.toFileAsync(report_file_path);
    });
});
const create_report_file = (report, report_file_name) => {
    const report_file_path = `${reports_path}${report_file_name}`;
    // destination will be created or overwritten by default.
    fs_1.default.copyFile(report_template_path, report_file_path, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        console.log('File was copied to destination');
        yield edit_report(report, report_file_path);
        console.log("FINISH");
    }));
};
exports.create_report_file = create_report_file;
