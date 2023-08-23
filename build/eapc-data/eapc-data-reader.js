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
exports.read_file_data_logs = exports.read_file_info = void 0;
// import fetch from 'node-fetch';
const xlsx_1 = __importDefault(require("xlsx"));
const xlstream_1 = require("xlstream");
const time_sheet_index = 0;
const probe_sheet_index = 1;
const data_sheet_index = 2;
const data_column_name_A_date = "Date";
const data_column_name_B_thickness = "Thickness (µm)";
const data_column_name_C_vac = "Uac,structure (V)";
const data_column_name_D_IR = "Iac,coupon (mA)";
const data_column_name_E_ac = "Jac,coupon (A/m²)";
const data_column_name_F_IR = "Rs,coupon (Ωm²)";
const data_column_name_G_IR = "Idc,coupon (mA)";
const data_column_name_H_dc = "Jdc,coupon (A/m²)";
const data_column_name_I_eon = "Eon,structure (V)";
const data_column_name_J_eoff = "Eoff,coupon (V)";
const EAPC_date_to_date = (eapc_date) => {
    //"2023-07-01-0000"
    const year = parseInt(eapc_date.substring(0, 4));
    console.log(year);
    const month = parseInt(eapc_date.substring(5, 7));
    console.log(month);
    const day = parseInt(eapc_date.substring(8, 10));
    console.log(day);
    const hour = parseInt(eapc_date.substring(11, 13));
    const mimnute = parseInt(eapc_date.substring(13, 15));
    console.log(hour);
    console.log(mimnute);
    const date = new Date(year, month - 1, day, hour, mimnute);
    console.log(date.toString());
    return date;
};
const read_file_info = (file_path) => {
    var workbook = xlsx_1.default.readFile(file_path);
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);
    // Get time period for report
    const time_sheet = workbook.Sheets[sheet_name_list[time_sheet_index]];
    // TODO: fix format
    const from_time = EAPC_date_to_date(time_sheet.B2.v);
    const to_time = EAPC_date_to_date(time_sheet.C2.v);
    // Get probe data
    const probe_sheet = workbook.Sheets[sheet_name_list[probe_sheet_index]];
    const prob_serial_number = probe_sheet.B3.v;
    return ({
        prob_serial_number,
        from_time,
        to_time
    });
};
exports.read_file_info = read_file_info;
const map_raw_data_to_data_log = (raw_data_obj) => ({
    date: new Date(raw_data_obj[data_column_name_A_date]),
    thickness: raw_data_obj[data_column_name_B_thickness],
    vac: raw_data_obj[data_column_name_C_vac],
    ac: raw_data_obj[data_column_name_E_ac],
    dc: raw_data_obj[data_column_name_H_dc],
    eon: raw_data_obj[data_column_name_I_eon],
    eoff: raw_data_obj[data_column_name_J_eoff]
});
const read_file_data_logs = (file_path, end_read_callback) => {
    const raw_data = [];
    (() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("HERE");
        const stream = yield (0, xlstream_1.getXlsxStream)({
            filePath: file_path,
            sheet: 2,
            withHeader: true,
            ignoreEmpty: true
        });
        stream.on("data", (x) => {
            raw_data.push(x.raw.obj);
            console.log(x.raw.obj.Date);
        });
        stream.on("end", () => {
            let data_logs = [];
            let last_eoff = 0;
            raw_data.forEach((rd, i) => {
                if (i > 0) { // First row have invalid values
                    let dl = map_raw_data_to_data_log(rd);
                    if (dl.eoff === 0) {
                        dl.eoff = last_eoff;
                    }
                    else {
                        last_eoff = dl.eoff;
                    }
                    data_logs.push(dl);
                }
            });
            end_read_callback(data_logs);
        });
    }))();
    console.log(raw_data);
};
exports.read_file_data_logs = read_file_data_logs;
