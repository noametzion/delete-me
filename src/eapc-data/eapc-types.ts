type data_log = {
    date: Date,
    thickness: number,
    vac: number,
    ac: number,
    dc: number,
    eon: number,
    eoff: number
}

type DataInfo = {
    prob_serial_number : string,
    from_time: Date,
    to_time: Date,
}

type EAPCReport = {
    info: DataInfo,
    thickness: {
        thickness_at_start: number,
        thickness_at_end: number,
        thickness_difference: number,
    },
    ac_dc: {
        vac_max: number,
        vac_min: number,
        vac_avg: number,
        vac_standard_deviation: number,
        vac_time_above_limit: number,
        ac_max: number,
        ac_min: number,
        ac_avg: number,
        ac_standard_deviation: number,
        ac_time_above_limit: number,
        dc_max: number,
        dc_min: number,
        dc_avg: number,
        dc_standard_deviation: number,
        dc_time_above_limit: number,
    },
    eon_eoff: {
        eon_max: number,
        eon_min: number,
        eon_avg: number,
        eon_standard_deviation: number,
        eon_time_above_limit: number,
        eon_eoff_diff_max: number,
        eon_eoff_diff_min: number,
        eon_eoff_diff_time_below_limit: number,
        eoff_max: number,
        eoff_min: number,
        eoff_avg: number,
        eoff_standard_deviation: number,
        eoff_time_above_limit: number,
    }
};
