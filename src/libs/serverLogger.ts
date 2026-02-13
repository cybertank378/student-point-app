//Files: src/libs/serverLogger.ts

export const serverLog = (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
        console.log(
            `[${new Date().toISOString()}][SERVER]`,
            ...args,
        );
    }
};