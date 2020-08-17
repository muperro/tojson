import * as dayjs from "dayjs";

import { ToJson, toJSON, fromObject, JsonValueFormat } from "../src";

describe("Unit Test", () => {

    it("string", () => {
        class StringClass {
            @ToJson()
            p1: string;
            @ToJson({ name: "property2" })
            p2: string;
            @ToJson({ format: JsonValueFormat.RAW })
            p3: string;
            @ToJson({ format: JsonValueFormat.BASE64 })
            p4: string;
            @ToJson({ format: JsonValueFormat.HEX })
            p5: string;
            @ToJson({ format: JsonValueFormat.BYTE_LENGTH })
            p6: string;
            @ToJson({ custom: (v: string) => v.substring(0, 1).padEnd(v.length, "*") })
            p7: string;
        }
        const o = { p1: "p1", p2: "p2", p3: "p3", p4: "p4", p5: "p5", p6: "p6", p7: "p7" };
        const c = fromObject(StringClass, o);
        const json = toJSON(c);
        expect(json["p1"]).toBe(o.p1);
        expect(json["property2"]).toBe(o.p2);
        expect(json["p3"]).toBe(o.p3);
        expect(json["p4"]).toBe(Buffer.from(o.p4).toString("base64"));
        expect(json["p5"]).toBe(Buffer.from(o.p5).toString("hex"));
        expect(json["p6"]).toBe(Buffer.from(o.p6).byteLength);
        expect(json["p7"]).toBe(o.p7.substring(0, 1).padEnd(o.p7.length, "*"));
    });

    it("Buffer", () => {
        class BufferClass {
            @ToJson()
            p1: Buffer;
            @ToJson({ name: "property2" })
            p2: Buffer;
            @ToJson({ format: JsonValueFormat.RAW })
            p3: Buffer;
            @ToJson({ format: JsonValueFormat.BASE64 })
            p4: Buffer;
            @ToJson({ format: JsonValueFormat.HEX })
            p5: Buffer;
            @ToJson({ format: JsonValueFormat.BYTE_LENGTH })
            p6: Buffer;
            @ToJson({ custom: (v: Buffer) => v.toJSON() })
            p7: Buffer;
        }
        const o = {
            p1: Buffer.from([0x01]),
            p2: Buffer.from([0x02]),
            p3: Buffer.from([0x03]),
            p4: Buffer.from([0x04]),
            p5: Buffer.from([0x05]),
            p6: Buffer.from([0x06]),
            p7: Buffer.from([0x07]),
        };
        const c = fromObject(BufferClass, o);
        const json = toJSON(c);
        expect(json["p1"]).toBe(o.p1);
        expect(json["property2"]).toBe(o.p2);
        expect(json["p3"]).toBe(o.p3);
        expect(json["p4"]).toBe(o.p4.toString("base64"));
        expect(json["p5"]).toBe(o.p5.toString("hex"));
        expect(json["p6"]).toBe(o.p6.byteLength);
        expect(json["p7"]).toStrictEqual(o.p7.toJSON());
    });

    it("number", () => {
        class NumberClass {
            @ToJson()
            p1: number;
            @ToJson({ name: "property2" })
            p2: number;
            @ToJson({ format: JsonValueFormat.RAW })
            p3: number;
            @ToJson({ format: JsonValueFormat.DT_YMD })
            p4: number;
            @ToJson({ format: JsonValueFormat.DT_YMD_HM })
            p5: number;
            @ToJson({ format: JsonValueFormat.DT_YMD_HMS })
            p6: number;
            @ToJson({ custom: (v: number) => v.toString(16) })
            p7: number;
        }
        const o = {
            p1: 1,
            p2: 2,
            p3: Date.now(),
            p4: Date.now(),
            p5: Date.now(),
            p6: Date.now(),
            p7: 999999,
        };
        const c = fromObject(NumberClass, o);
        const json = toJSON(c);
        expect(json["p1"]).toBe(o.p1);
        expect(json["property2"]).toBe(o.p2);
        expect(json["p3"]).toBe(o.p3);
        expect(json["p4"]).toBe(dayjs(new Date(o.p4)).format("YYYY-MM-DD"));
        expect(json["p5"]).toBe(dayjs(new Date(o.p5)).format("YYYY-MM-DD HH:mm"));
        expect(json["p6"]).toBe(dayjs(new Date(o.p6)).format("YYYY-MM-DD HH:mm:ss"));
        expect(json["p7"]).toBe(o.p7.toString(16));
    });

    it("Date", () => {
        class DateClass {
            @ToJson()
            p1: Date;
            @ToJson({ name: "property2" })
            p2: Date;
            @ToJson({ format: JsonValueFormat.RAW })
            p3: Date;
            @ToJson({ format: JsonValueFormat.DT_YMD })
            p4: Date;
            @ToJson({ format: JsonValueFormat.DT_YMD_HM })
            p5: Date;
            @ToJson({ format: JsonValueFormat.DT_YMD_HMS })
            p6: Date;
            @ToJson({ custom: (v: Date) => v.getFullYear() })
            p7: Date;
        }
        const o = {
            p1: new Date(0),
            p2: new Date(),
            p3: new Date(),
            p4: new Date(),
            p5: new Date(),
            p6: new Date(),
            p7: new Date(),
        };
        const c = fromObject(DateClass, o);
        const json = toJSON(c);
        expect(json["p1"]).toBe(o.p1);
        expect(json["property2"]).toBe(o.p2);
        expect(json["p3"]).toBe(o.p3);
        expect(json["p4"]).toBe(dayjs(o.p4).format("YYYY-MM-DD"));
        expect(json["p5"]).toBe(dayjs(o.p5).format("YYYY-MM-DD HH:mm"));
        expect(json["p6"]).toBe(dayjs(o.p6).format("YYYY-MM-DD HH:mm:ss"));
        expect(json["p7"]).toBe(o.p7.getFullYear());
    });
    
    it("JSON", () => {
        class Test {
            @ToJson({ name: "one" })
            p1: number;
            @ToJson({ name: "two" })
            p2: string;
        }
        class JsonClass {
            @ToJson()
            p1: Test;
            @ToJson({ format: JsonValueFormat.JSON })
            p2: Test;
        }
        const o1 = { p1: 1, p2: "p2" };
        const o2 = { p1: 2, p2: "p.2" };
        const o = { p1: fromObject(Test, o1), p2: fromObject(Test, o2) };
        const c = fromObject(JsonClass, o);
        const json = toJSON(c);
        expect(json["p1"]).toBe(o.p1);
        expect(json["p2"]).toStrictEqual(toJSON(o.p2));
    });

    it("Array", () => {
        class Test {
            @ToJson({ name: "one" })
            p1: number;
            @ToJson({ name: "two" })
            p2: string;
        }
        const o1 = { p1: 1, p2: "p2" };
        const o2 = { p1: 2, p2: "p.2" };
        const c1 = fromObject(Test, o1);
        const c2 = fromObject(Test, o2);
        const json = toJSON([c1, c2]);
        expect(json.length).toBe(2);
        expect(json[0]["one"]).toBe(o1.p1);
        expect(json[0]["two"]).toBe(o1.p2);
        expect(json[1]["one"]).toBe(o2.p1);
        expect(json[1]["two"]).toBe(o2.p2);
    });

    it("TypeError (string, Buffer)", () => {
        try {
            class Test {
                @ToJson({ format: JsonValueFormat.DT_YMD })
                p1: string;
            }
            const o = { p1: "p1" };
            const c = fromObject(Test, o);
            const json = toJSON(c);
            expect(false).toBeTruthy();
        } catch (err) {
            expect(err instanceof TypeError).toBeTruthy();
            expect((err as TypeError).message.includes("JsonValueFormat.DT_*")).toBeTruthy();
        }
    });

    it("TypeError (Date, number)", () => {
        try {
            class Test {
                @ToJson({ format: JsonValueFormat.BASE64 })
                p1: number;
            }
            const o = { p1: 1 };
            const c = fromObject(Test, o);
            const json = toJSON(c);
            expect(false).toBeTruthy();
        } catch (err) {
            expect(err instanceof TypeError).toBeTruthy();
            expect((err as TypeError).message.includes("JsonValueFormat.BASE64")).toBeTruthy();
        }
    });    

});
