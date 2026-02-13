//Files: src/sections/dashboard/molecules/StudentViolationTable.tsx
"use client";

import {
    Table,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@/shared-ui/component/Table";
import { useState, useMemo, useEffect } from "react";
import getInitials from "@/libs/utils";
import Image from "next/image";
import Pagination from "@/shared-ui/component/Pagination";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";

/* ================================
   DATA
================================ */
const data = [
    { name: "Ahmad Fauzi", kelas: "8A", jenis: "Terlambat", poin: 10, status: "SP1", image: "" },
    { name: "Siti Nurhaliza", kelas: "9B", jenis: "Bolos", poin: 25, status: "SP2", image: "" },
    { name: "Rizky Pratama", kelas: "7A", jenis: "Tidak Memakai Seragam", poin: 15, status: "SP1", image: "" },
    { name: "Dewi Lestari", kelas: "8B", jenis: "Rambut Tidak Sesuai", poin: 20, status: "SP2", image: "" },
    { name: "Bagas Saputra", kelas: "9A", jenis: "Terlambat", poin: 5, status: "SP1", image: "" },
    { name: "Nabila Putri", kelas: "7B", jenis: "Bolos", poin: 30, status: "SP2", image: "" },
];

type SortKey = "name" | "kelas" | "jenis" | "poin" | null;

export default function StudentViolationTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const itemsPerPage = 3;

    /* =========================
       DEBOUNCE SEARCH
    ========================= */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    /* =========================
       FILTER
    ========================= */
    const processedData = useMemo(() => {
        let result = [...data];

        if (debouncedSearch) {
            result = result.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
            );
        }

        if (statusFilter !== "ALL") {
            result = result.filter((item) => item.status === statusFilter);
        }

        return result;
    }, [debouncedSearch, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = processedData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

            {/* HEADER + FILTER (SEJAJAR) */}
            <div className="px-6 mt-6 mb-8 flex items-center justify-between">

                {/* LEFT: TITLE */}
                <h3 className="text-base font-semibold text-gray-800">
                    Pelanggaran Terbaru
                </h3>

                {/* RIGHT: FILTER */}
                <div className="flex items-center gap-4">
                    <TextField
                        placeholder="Cari siswa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="md"
                        variant="outlined"
                        leftIcon={FaSearch}
                        className="w-64"
                    />

                    <SelectField
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        wrapperClassName="w-40"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="SP1">SP1</option>
                        <option value="SP2">SP2</option>
                    </SelectField>
                </div>

            </div>

            {/* TABLE */}
            <Table wrapperClassName="border-t border-gray-100">

                <TableHead>
                    <tr className="bg-gray-100 h-12">
                        <TableHeaderCell className="w-16 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Siswa
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Nama
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Kelas
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Tipe Pelanggaran
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Poin
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Status
                        </TableHeaderCell>
                    </tr>
                </TableHead>

                <tbody>
                {paginatedData.map((item, index) => (
                    <TableRow
                        key={index}
                        className="border-b border-gray-100 hover:bg-indigo-50/40 transition-colors"
                    >
                        <TableCell className="px-6 py-4">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                    {getInitials(item.name)}
                                </div>
                            )}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium text-gray-900">
                            {item.name}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-gray-600">
                            {item.kelas}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-gray-600">
                            {item.jenis}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium text-gray-800">
                            {item.poin}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === "SP2"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {item.status}
                </span>
                        </TableCell>
                    </TableRow>
                ))}
                </tbody>

            </Table>

            {/* PAGINATION */}
            <div className=" mb-4 px-6 border-t border-gray-100">
                <Pagination
                    currentPage={currentPage}
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                    onPageChangeAction={setCurrentPage}
                />
            </div>

        </div>
    );
}
