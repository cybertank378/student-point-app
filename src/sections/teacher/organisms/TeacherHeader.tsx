//Files: src/sections/teacher/organisms/TeacherHeader.tsx

"use client";

import { useState } from "react";
import SelectField from "@/shared-ui/component/SelectField";
import SearchField from "@/shared-ui/component/SearchField";
import Button from "@/shared-ui/component/Button";
import { FaPlus, FaFileExport } from "react-icons/fa6";
import {HiOutlineUpload} from "react-icons/hi";

export default function TeacherHeader() {
    const [search, setSearch] = useState("");

    return (
        <div className="bg-transparent overflow-hidden">
            <div className="px-8 py-6 space-y-6">
                {/* ===== Title ===== */}
                <h3 className="text-base font-semibold text-gray-700">
                    Filters
                </h3>

                {/* ===== Filters Row ===== */}
                <div className="grid grid-cols-3 gap-6">
                    <SelectField>
                        <option>Select Role</option>
                    </SelectField>

                    <SelectField>
                        <option>Select Plan</option>
                    </SelectField>

                    <SelectField>
                        <option>Select Status</option>
                    </SelectField>
                </div>
            </div>

            {/* ===== Divider ===== */}
            <div className="border-t" />

            {/* ===== Action Row ===== */}
            <div className="px-8 py-5 flex items-center justify-between">
                {/* Left: Export */}
                <Button
                    variant="outline"
                    leftIcon={HiOutlineUpload}
                >
                    Export
                </Button>

                {/* Right: Search + Add */}
                <div className="flex items-center gap-4">
                    <SearchField
                        value={search}
                        onChange={setSearch}
                        placeholder="Search User"
                        className="w-72"
                    />

                    <Button
                        variant="filled"
                        color="primary"
                        leftIcon={FaPlus}
                    >
                        Add New User
                    </Button>
                </div>
            </div>
        </div>
    );
}
