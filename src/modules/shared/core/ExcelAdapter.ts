// File: src/modules/shared/infrastructure/excel/ExcelAdapter.ts

import ExcelJS from "exceljs";

type BinaryInput = ArrayBuffer | Uint8Array;

export interface ExcelParseOptions<T> {
    sheetIndex?: number;
    headerRow?: number;
    mapRow: (row: Record<string, unknown>, rowNumber: number) => T;
    validateRow?: (data: T, rowNumber: number) => void;
}

export interface ExcelExportOptions<T> {
    sheetName?: string;
    columns: {
        header: string;
        key: keyof T;
        width?: number;
    }[];
    data: T[];
}

export class ExcelAdapter {
    /**
     * Parse Excel buffer into typed objects
     * Streaming-safe and enterprise ready
     */
    async parse<T>(
        input: BinaryInput,
        options: ExcelParseOptions<T>
    ): Promise<T[]> {
        const workbook = new ExcelJS.Workbook();

        const uint8 =
            input.constructor === Uint8Array
                ? (input as Uint8Array)
                : new Uint8Array(input);


        await workbook.xlsx.load(
            uint8 as unknown as Parameters<
                typeof workbook.xlsx.load
            >[0]
        );


        const sheet = workbook.worksheets[options.sheetIndex ?? 0];
        if (!sheet) {
            throw new Error("Worksheet not found");
        }

        const headerRowNumber = options.headerRow ?? 1;
        const headerRow = sheet.getRow(headerRowNumber);

        const headers: string[] = [];

        headerRow.eachCell((cell, colNumber) => {
            headers[colNumber - 1] = String(cell.value ?? "").trim();
        });

        const results: T[] = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber <= headerRowNumber) return;

            const rowData: Record<string, unknown> = {};

            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (!header) return;
                rowData[header] = cell.value;
            });

            const mapped = options.mapRow(rowData, rowNumber);

            if (options.validateRow) {
                options.validateRow(mapped, rowNumber);
            }

            results.push(mapped);
        });

        return results;
    }

    /**
     * Export typed objects into Excel buffer
     */
    async export<T>(
        options: ExcelExportOptions<T>
    ): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(options.sheetName ?? "Sheet1");

        sheet.columns = options.columns.map((col) => ({
            header: col.header,
            key: String(col.key),
            width: col.width ?? 20,
        }));

        sheet.addRows(options.data);

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}