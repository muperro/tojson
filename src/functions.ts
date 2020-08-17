import * as dayjs from "dayjs";

import { SimpleJson, ObjectType, JsonValueFormat, ToJsonOptions } from "./types";

/**
 * object to JSON.
 * @param o object by using the decorator of ToJson
 */
export function toJSON(o: any): SimpleJson | SimpleJson[] {
    if (Array.isArray(o)) {
        const r: SimpleJson[] = [];
        for (const i of o) {
            r.push(toJSON(i));
        }
        return r;
    } else {
        const r: SimpleJson = {};
        const keys = Reflect.getMetadata("ToJson:member", o);
        for (let key of keys) {
            const value = o[key];
            const options: ToJsonOptions = Reflect.getMetadata("ToJsonOptions", o, key);
            if (options) {
                if (options.name) {
                    key = options.name;
                } // name
                if (value) {
                    switch (options.format) {
                        case JsonValueFormat.BASE64:
                            r[key] =
                                value instanceof Buffer
                                    ? value.toString("base64")
                                    : Buffer.from(value, "utf8").toString("base64");
                            break;
                        case JsonValueFormat.HEX:
                            r[key] =
                                value instanceof Buffer ? value.toString("hex") : Buffer.from(value, "utf8").toString("hex");
                            break;
                        case JsonValueFormat.BYTE_LENGTH:
                            r[key] = value instanceof Buffer ? value.byteLength : Buffer.from(value, "utf8").byteLength;
                            break;
                        case JsonValueFormat.DT_YMD:
                            r[key] =
                                value instanceof Date
                                    ? dayjs(value).format("YYYY-MM-DD")
                                    : dayjs(new Date(value)).format("YYYY-MM-DD");
                            break;
                        case JsonValueFormat.DT_YMD_HM:
                            r[key] =
                                value instanceof Date
                                    ? dayjs(value).format("YYYY-MM-DD HH:mm")
                                    : dayjs(new Date(value)).format("YYYY-MM-DD HH:mm");
                            break;
                        case JsonValueFormat.DT_YMD_HMS:
                            r[key] =
                                value instanceof Date
                                    ? dayjs(value).format("YYYY-MM-DD HH:mm:ss")
                                    : dayjs(new Date(value)).format("YYYY-MM-DD HH:mm:ss");
                            break;
                        case JsonValueFormat.JSON:
                            r[key] = toJSON(value);
                            break;
                        default:
                            if (options.custom) {
                                // custom format
                                r[key] = options.custom(value);
                            } else {
                                // format is not setting
                                r[key] = value;
                            }
                            break;
                    } // value is not empty
                } else {
                    r[key] = undefined;
                } // value is empty
            } else {
                r[key] = value;
            }
        }
        return r;
    }
}

/**
 * onject to instance.
 * @param target type
 * @param from objet
 */
export function fromObject<T>(target: ObjectType<T>, from: any): T {
    const to = Reflect.construct(target, []);
    const keys = Object.keys(from);
    for (const key of keys) {
        to[key] = from[key];
    }
    return to as T;
}