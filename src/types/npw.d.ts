// src/types/npw.d.ts

/** Single defect record for chart plotting */
export interface ChartDefectDataItem {
    CHART_ID: number;
    CHART_SEQ: number | null;  // <-- allow null
    CHART_NAME: string;
    MEAN_VALUE: number | null; // <-- allow null
    UPDATE_TIME: string;
    PROCESSUNIT_BY_DATA: string;
    PROCESSUNIT: string;
    LOT: string;
    INSPECT_EQUIP_ID: string;
    BATCH: string;
    MONITOR_TYPE: string;
    RECIPE: string;
    OVER_3_TIME_SIGMA: string;
    XBAR: number;
    SIGMA: number;
    AVG1STD: number;
    AVG2STD: number;
    AVG3STD: number;
    UCL: number;
    UCHART_ID: number;
    IS_BS: string;
    DEFECT_SIZE_D_CRITERIA: number;
    [key: string]: any;
}

/** Basic chart info */
export interface ChartBasicInfo {
    CHART_NAME: string;
    MOVE_IN_TIME: string;
    [key: string]: any;
}

/** Full chart data for Npw page */
export interface NpwItem {
    basicInfo: ChartBasicInfo;
    chartDefectData: ChartDefectDataItem[];
}
