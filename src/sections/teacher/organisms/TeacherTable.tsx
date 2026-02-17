//Files: src/sections/teacher/organisms/TeacherTable.tsx

"use client";

import dummy from "@/sections/teacher/data/dummy.json";
import {Teacher} from "@/modules/teacher/domain/entity/Teacher";

import {
    FaEye,
    FaTrash,
    FaPenToSquare
} from "react-icons/fa6";
import { TeacherRole } from "@/libs/utils";
import {Chip} from "@/shared-ui/component/Chip";

export default function TeacherTable() {
    const teachers = dummy.teachers.map(
        (t) =>
            new Teacher(
                t.id,
                t.userId,
                t.nip,
                t.name,
                t.phone,
                t.email,
                t.roles as TeacherRole[],
                t.homeroomClassId
            )
    );

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                {/* ================= HEADER ================= */}
                <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                    <th className="px-6 py-4 text-left">
                        <input type="checkbox" />
                    </th>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Action</th>
                </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                {teachers.map((teacher) => {
                    const isActive = teacher.email !== null;

                    return (
                        <tr
                            key={teacher.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            {/* Checkbox */}
                            <td className="px-6 py-4">
                                <input type="checkbox" />
                            </td>

                            {/* User */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                                        {teacher.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {teacher.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {teacher.nip}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4 text-gray-600">
                                {teacher.email ?? "-"}
                            </td>

                            {/* Role */}
                            <td className="px-6 py-4">
                                <div className="flex gap-2 flex-wrap">
                                    {teacher.roles.map((role) => (
                                        <Chip key={role} size="sm" variant="soft">
                                            {role}
                                        </Chip>
                                    ))}
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                                  <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          isActive
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-200 text-gray-600"
                                      }`}
                                  >
                                    {isActive ? "Active" : "Inactive"}
                                  </span>
                            </td>

                            {/* Action */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 text-gray-500">
                                    {/* View */}
                                    <button
                                        className="p-1 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        title="View"
                                    >
                                        <FaEye size={14} />
                                    </button>

                                    {/* Edit */}
                                    <button
                                        className="p-1 rounded hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                        title="Edit"
                                    >
                                        <FaPenToSquare size={14} />
                                    </button>

                                    {/* Remove */}
                                    <button
                                        className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Remove"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* ================= FOOTER ================= */}
            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
                <span>Rows per page: 10</span>
                <span>1–5 of {teachers.length}</span>
            </div>
        </div>
    );
}
