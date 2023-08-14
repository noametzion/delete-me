// import fetch from 'node-fetch';
import { time } from 'console';
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

type Report = {
    info: {
        prob_serial_number: string,
        from_time: Date,
        to_time: Date,
    },
    thickness: {
        thickness_at_start: number,
        thickness_at_end: number,
        thickness_difference: number,
    },
    ac_dc: {
        vac_max: number,
        vac_min: number,
        vac_avg: number,
        vac_time_above_limit: number,
        ac_max: number,
        ac_min: number,
        ac_time_above_limit: number,
        ac_avg: number,
        dc_max: number,
        dc_min: number,
        dc_avg: number,
    },
    eon_eoff: {
        eon_max: number,
        eon_min: number,
        eon_avg: number,
        eon_time_above_limit: number,
        eon_eoff_diff_max: number,
        eon_eoff_diff_min: number,
        eon_eoff_diff_time_below_limit: number,
        eoff_max: number,
        eoff_min: number,
        eoff_avg: number,
        eoff_time_above_limit: number,
    }
};

const file_path = './data/Pi20306632-from-2023-07-01-0100-to-2023-08-01-0000.xlsx';
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
const limit_vac = 15

type data_log = {
    date: Date,
    thickness: number,
    vac: number,
    ac: number,
    dc: number,
    eon: number,
    eoff: number
}

const get_max = (data_array: number[]) => Math.max(...data_array);
const get_min = (data_array: number[]) => Math.min(...data_array);
const get_avg = (data_array: number[]) => {
    let sum = 0;
    let count = 0;
    data_array.forEach((d) => {
        if (d !== undefined) {
            sum += d;
            count++;
        }
    })
    return sum/count;
}
const get_time_diff = (date_from: Date, date_to: Date) => (date_to.getTime() - date_from.getTime()) / 1000 / 60;
const check_outside_limits = (value: number, max_limit?: number, min_limit?: number) => {
    const is_above_max_limit = max_limit !== undefined && value > max_limit;
    const is_below_min_limit = min_limit !== undefined && value < min_limit;
    return is_above_max_limit || is_below_min_limit;
}
// All 3 functions returns the time in minutes
const get_total_time_outside_limit = (date_value_pairs: { date: Date; value: number; }[], max_limit?: number, min_limit?: number) => {
    let total_minutes = 0;
    date_value_pairs.forEach((dv_pair, dv_pair_index) => {
        if(dv_pair_index > 0 && check_outside_limits(dv_pair.value, max_limit, min_limit)) {
            total_minutes += get_time_diff(date_value_pairs[dv_pair_index -1].date, dv_pair.date);
        }
    })
    return total_minutes;
}
function get_time_above_limit(date_value_pairs: { date: Date; value: number; }[], max_limit: number) {
    return get_total_time_outside_limit(date_value_pairs, max_limit);
}
function get_time_below_limit(date_value_pairs: { date: Date; value: number; }[], min_limit: number) {
    return get_total_time_outside_limit(date_value_pairs, undefined, min_limit);
}


const readFromFile = () => {

    var workbook = xlsx.readFile(file_path);
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);

    // Get time period for report
    const time_sheet = workbook.Sheets[sheet_name_list[time_sheet_index]];

    // TODO: fix format
    const from_time = time_sheet.B2.v;
    const to_time = time_sheet.C2.v;

    // Get probe data
    const probe_sheet = workbook.Sheets[sheet_name_list[probe_sheet_index]];

    const prob_serial_number = probe_sheet.B3.v;

    // Get log data
    let data_sheet = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[data_sheet_index]], 
        {header: [
            data_column_name_A_date,
            data_column_name_B_thickness,
            data_column_name_C_vac,
            data_column_name_D_IR,
            data_column_name_E_ac,
            data_column_name_F_IR,
            data_column_name_G_IR,
            data_column_name_H_dc,
            data_column_name_I_eon,
            data_column_name_J_eoff,
        ]}
    );
    data_sheet.splice(0, 2);
    const data_logs : data_log[] = data_sheet.map((ol: any) => ({
        date: new Date(ol[data_column_name_A_date]),
        thickness: ol[data_column_name_B_thickness],
        vac: ol[data_column_name_C_vac],
        ac: ol[data_column_name_E_ac],
        dc: ol[data_column_name_H_dc],
        eon: ol[data_column_name_I_eon],
        eoff: ol[data_column_name_J_eoff]
    }));

    const thickness_at_start = data_logs[0].thickness;
    const thickness_at_end = data_logs[data_logs.length-1].thickness;
    const thickness_difference = thickness_at_start - thickness_at_end;

    // MIN, MAX, AVG time above 15 - V
    const vac_data_array = data_logs.map((dl) => dl.vac);
    const vac_max = get_max(vac_data_array);
    const vac_min = get_min(vac_data_array);
    const vac_avg = get_avg(vac_data_array);
    const vac_time_above_limit = get_time_above_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.vac})), 
        15
    );

    // MIN, MAX, AVG, time above 20 - V
    const ac_data_array = data_logs.map((dl) => dl.ac);
    const ac_max = get_max(ac_data_array);
    const ac_min = get_min(ac_data_array);
    const ac_avg = get_avg(ac_data_array);
    const ac_time_above_limit = get_time_above_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.ac})), 
        20
    );

    // MIN, MAX, AVG, time above 0.03
    const dc_data_array = data_logs.map((dl) => dl.dc);
    const dc_max = get_max(dc_data_array);
    const dc_min = get_min(dc_data_array);
    const dc_avg = get_avg(dc_data_array);
    const dc_time_above_limit = get_time_above_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.dc})), 
        0.03
    );

    // MIN, MAX, AVG, time above -1.5, Eoff - Eonn (last Eoff) ->MIN, MAX, total time under 0 
    const eon_data_array = data_logs.map((dl) => dl.eon);
    const eon_max = get_max(eon_data_array);
    const eon_min = get_min(eon_data_array);
    const eon_avg = get_avg(eon_data_array);
    const eon_time_above_limit = get_time_above_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.eon})), 
        -1.5
    );
    // TODO: here should consider the old data because the one that measure every second dont always have the off value
    const eon_eoff_diff_array = data_logs.map((dl) => dl.eoff - dl.eon);
    const eon_eoff_diff_max = get_max(eon_eoff_diff_array);
    const eon_eoff_diff_min = get_min(eon_eoff_diff_array);
    // TODO: here should consider the old data because the one that measure every second dont always have the off value
    const eon_eoff_diff_time_below_limit = get_time_below_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.eoff - dl.eon})), 
        0
    );

    // MIN, MAX, AVG, Number above -0.850
    // TODO: remove undefined data!  (i did it at avg but needs to be done differently at the calc above limit)
    // TODO: when calc eoff should use the last date that have measurment !
    const eoff_data_array = data_logs.map((dl) => dl.eoff);
    const eoff_max = get_max(eoff_data_array);
    const eoff_min = get_min(eoff_data_array);
    const eoff_avg = get_avg(eoff_data_array);
    const eoff_time_above_limit = get_time_above_limit(
        data_logs.map((dl) => ({date: dl.date, value: dl.eoff})), 
        -0.85
    );

    // TODO: add units for each value'
    // TODO: math.round
    
    return ({
        info: {
            prob_serial_number,
            from_time,
            to_time,
        },
        thickness: {
            thickness_at_start,
            thickness_at_end,
            thickness_difference,
        },
        ac_dc: {
            vac_max,
            vac_min,
            vac_avg,
            vac_time_above_limit,
            ac_max,
            ac_min,
            ac_avg,
            ac_time_above_limit,
            dc_max,
            dc_min,
            dc_avg,
            dc_time_above_limit
        },
        eon_eoff: {
            eon_max,
            eon_min,
            eon_avg,
            eon_time_above_limit,
            eon_eoff_diff_max,
            eon_eoff_diff_min,
            eon_eoff_diff_time_below_limit,
            eoff_max,
            eoff_min,
            eoff_avg,
            eoff_time_above_limit,
        }
    });
}

export {readFromFile};