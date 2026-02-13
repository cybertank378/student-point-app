//Files: src/sections/master-data/academic-years/data/dummyAcademicYears.ts

export interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export const dummyAcademicYears: AcademicYear[] = [
    {
        id: "1",
        name: "2021/2022",
        startDate: "2021-07-01",
        endDate: "2022-06-30",
        isActive: false,
    },
    {
        id: "2",
        name: "2022/2023",
        startDate: "2022-07-01",
        endDate: "2023-06-30",
        isActive: false,
    },
    {
        id: "3",
        name: "2023/2024",
        startDate: "2023-07-01",
        endDate: "2024-06-30",
        isActive: true,
    },
];
