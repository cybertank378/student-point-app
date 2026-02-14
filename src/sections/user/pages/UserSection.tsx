//Files: src/sections/user/pages/UserSection.tsx

"use client";

import { useState, useMemo } from "react";
import users from "../data/dummy.json";
import {
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/shared-ui/component/Table";
import SelectField from "@/shared-ui/component/SelectField";
import Pagination from "@/shared-ui/component/Pagination";
import { FaPlus, FaSearch, FaFileExport, FaUserGraduate } from "react-icons/fa";
import Button from "@/shared-ui/component/Button";

export default function UserSection() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  /* ================= FILTER ================= */
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      result = result.filter((u) =>
        Object.values(u).join(" ").toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((u) => u.status === statusFilter);
    }

    return result;
  }, [search, roleFilter, statusFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Nonaktif":
        return "bg-gray-200 text-gray-600";
      case "Pindah":
        return "bg-orange-100 text-orange-600";
      case "Lulus":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Total Siswa", value: "520", change: "+12%" },
          { title: "Total Guru", value: "45", change: "+5%" },
          { title: "Siswa Aktif", value: "498", change: "-2%" },
          { title: "Siswa Lulus", value: "22", change: "+18%" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl shadow-sm p-5 flex justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-semibold mt-1">
                {item.value}
                <span className="text-green-500 text-sm ml-2">
                  ({item.change})
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Data Semester Ini</p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FaUserGraduate />
            </div>
          </div>
        ))}
      </div>

      {/* ================= FILTER & TABLE ================= */}
      <div className="bg-white border rounded-2xl shadow-sm">
        {/* FILTER HEADER */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="grid grid-cols-3 gap-4">
            <SelectField
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Select Role</option>
              <option value="Siswa">Siswa</option>
              <option value="Guru">Guru</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Admin">Admin</option>
            </SelectField>

            <SelectField>
              <option>Select Kelas</option>
              <option>7A</option>
              <option>7B</option>
              <option>8A</option>
              <option>8B</option>
              <option>9A</option>
              <option>9B</option>
            </SelectField>

            <SelectField
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Select Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Pending">Pending</option>
              <option value="Nonaktif">Nonaktif</option>
              <option value="Pindah">Pindah</option>
              <option value="Lulus">Lulus</option>
            </SelectField>
          </div>

          {/* EXPORT + SEARCH + ADD */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="filled"
              color="secondary"
              size="md"
              leftIcon={FaFileExport}
            >
              Export
            </Button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search User"
                  className="pl-9 pr-3 py-2 text-sm border rounded-lg outline-none"
                />
              </div>

              <Button
                variant="filled"
                color="primary"
                size="md"
                leftIcon={FaPlus}
              >
                Add New User
              </Button>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Table>
          <TableHead>
            <tr className="bg-gray-50">
              <TableHeaderCell>
                <input type="checkbox" />
              </TableHeaderCell>
              <TableHeaderCell>USER</TableHeaderCell>
              <TableHeaderCell>EMAIL</TableHeaderCell>
              <TableHeaderCell>ROLE</TableHeaderCell>
              <TableHeaderCell>KELAS</TableHeaderCell>
              <TableHeaderCell>STATUS</TableHeaderCell>
              <TableHeaderCell>ACTION</TableHeaderCell>
            </tr>
          </TableHead>

          <tbody>
            {paginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input type="checkbox" />
                </TableCell>

                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">NIS: {user.nis}</div>
                </TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.kelas}</TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${statusBadge(
                      user.status,
                    )}`}
                  >
                    {user.status}
                  </span>
                </TableCell>

                <TableCell>•••</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Rows per page: {itemsPerPage}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChangeAction={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
