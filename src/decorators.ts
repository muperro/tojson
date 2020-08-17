import "reflect-metadata";

import { JsonValueFormat, ToJsonOptions} from "./types";

/**
 * Property decorator for toJSON(object)
 * @param options Options of @ToJson decorator (optional)
 */
export function ToJson(options?: ToJsonOptions): PropertyDecorator {
    return (target: any, key: string | symbol): void => {
        const t = Reflect.getMetadata("design:type", target, key);
        if (options) {
            if (t.name !== "Date" && t.name !== "Number") {
                switch (options.format) {
                    case JsonValueFormat.DT_YMD:
                    case JsonValueFormat.DT_YMD_HM:
                    case JsonValueFormat.DT_YMD_HMS:
                        throw new TypeError(
                            `If the format of options is JsonValueFormat.DT_*, the type of property MUST be Date or number. but this property (${String(key)}) type is ${t.name}.`
                        );
                }
            }
            if (t.name !== "String" && t.name !== "Buffer") {
                switch (options.format) {
                    case JsonValueFormat.BASE64:
                    case JsonValueFormat.HEX:
                    case JsonValueFormat.BYTE_LENGTH:
                        throw new TypeError(
                            `If the format of options is JsonValueFormat.BASE64, HEX, BYTE_LENGTH, the type of property MUST be Buffer or string. but this property (${String(key)}) type is ${t.name}.`
                        );
                }
            }
        }
        Reflect.defineMetadata("ToJsonOptions", options, target, key);
        const m: string[] = Reflect.getMetadata("ToJson:member", target) || [];
        m.push(String(key));
        Reflect.defineMetadata("ToJson:member", m, target);
    };
}