export abstract class SimpleJson {
    [key: string]: any;
}

export declare type ObjectType<T> = {
    new (): T;
} | Function;

/**
 * Enum of json value format.
 */
export enum JsonValueFormat {
    /** raw format */
    RAW = "raw",
    /** base64 format */
    BASE64 = "base64",
    /** hexadecimal format */
    HEX = "hex",
    /** length of byte array */
    BYTE_LENGTH = "byte_length",
    /** YYYY-MM-DD format of date */
    DT_YMD = "dt_ymd",
    /** YYYY-MM-DD HH:mm format of date */
    DT_YMD_HM = "dt_ymd_hm",
    /** YYYY-MM-DD HH:mm:ss format of date */
    DT_YMD_HMS = "dt_ymd_hms",
    /** json format */
    JSON = "json",
}

/**
 * Options of @ToJson decorator.
 * - name: the name of key. (optional)
 * - format: the format of value. (optional)
 * - custom: custom format of value. (optional)
 */
export interface ToJsonOptions {
    /**
     * the name of key. (optional)
     */
    name?: string;

    /**
     * the format of value. (optional)
     */
    format?: JsonValueFormat;

    /**
     * custom format of value. (optional)
     */
    custom?: (v: any) => any;
}
