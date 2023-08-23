import fs from 'fs';
import moment from 'moment';
const XlsxPopulate = require('xlsx-populate');


const report_template_path = './template/report_template.xlsx';
const reports_path = './reports/';
const report_sheet_name = "Sheet1";

const edit_report = async (report: EAPCReport, report_file_path: string) => {
    XlsxPopulate.fromFileAsync(report_file_path).then((workbook: any) => {

        // Edit info
        const from_time = moment(report.info.from_time).format("DD/MM/yyyy hh:mm");
        const to_time = moment(report.info.to_time).format("DD/MM/yyyy hh:mm");
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
        workbook.sheet(report_sheet_name).cell("F20").value(`${report.eon_eoff.eoff_standard_deviation.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C21").value(`${report.eon_eoff.eoff_time_above_limit.toFixed(2)}`);
        
        workbook.sheet(report_sheet_name).cell("C23").value(`${report.eon_eoff.eon_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F23").value(`${report.eon_eoff.eon_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C24").value(`${report.eon_eoff.eon_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F24").value(`${report.eon_eoff.eon_standard_deviation.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C25").value(`${report.eon_eoff.eon_time_above_limit.toFixed(2)}`);

        workbook.sheet(report_sheet_name).cell("C27").value(`${report.eon_eoff.eon_eoff_diff_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F27").value(`${report.eon_eoff.eon_eoff_diff_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C28").value(`${report.eon_eoff.eon_eoff_diff_time_below_limit.toFixed(2)}`);
        
        // Edit ac dc
        workbook.sheet(report_sheet_name).cell("C30").value(`${report.ac_dc.dc_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F30").value(`${report.ac_dc.dc_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C31").value(`${report.ac_dc.dc_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F31").value(`${report.ac_dc.dc_standard_deviation.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C32").value(`${report.ac_dc.dc_time_above_limit.toFixed(2)}`);

        workbook.sheet(report_sheet_name).cell("C34").value(`${report.ac_dc.vac_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F34").value(`${report.ac_dc.vac_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C35").value(`${report.ac_dc.vac_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F35").value(`${report.ac_dc.vac_standard_deviation.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C36").value(`${report.ac_dc.vac_time_above_limit.toFixed(2)}`);

        workbook.sheet(report_sheet_name).cell("C38").value(`${report.ac_dc.ac_max.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F38").value(`${report.ac_dc.ac_min.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C39").value(`${report.ac_dc.ac_avg.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("F39").value(`${report.ac_dc.ac_standard_deviation.toFixed(2)}`);
        workbook.sheet(report_sheet_name).cell("C40").value(`${report.ac_dc.ac_time_above_limit.toFixed(2)}`);
        
        // Write to file.
        return workbook.toFileAsync(report_file_path);
    });
};

const create_report_file = (report: EAPCReport, report_file_name: string) => {
    
    const report_file_path = `${reports_path}${report_file_name}`;

    // destination will be created or overwritten by default.
    fs.copyFile(report_template_path, report_file_path, async (err) => {
        if (err) throw err;
        console.log('File was copied to destination');
        await edit_report(report, report_file_path);
        console.log("FINISH");
    });
}

export {create_report_file};