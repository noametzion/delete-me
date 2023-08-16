import { read_file_data_logs, read_file_info } from "./eapc-data/expc-data-reader";
import { create_report} from "./eapc-data/report-creator";


const file_path = './data/Pi20306632-from-2023-06-01-0000-to-2023-06-30-2300.xlsx';


const getReport = () =>  {
    const info = read_file_info(file_path);
    const after_data_read = (data_logs: data_log[]) => {
        const report = create_report(data_logs, info)
        console.log(report);
    };
    read_file_data_logs(file_path, after_data_read);
}

getReport();