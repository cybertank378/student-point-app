//Files: src/sections/religion/molecules/ReligionTable.tsx
"use client";

import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
} from "@/shared-ui/component/Table";

import { Modal } from "@/shared-ui/component/Modal";
import Button from "@/shared-ui/component/Button";
import Loading from "@/shared-ui/component/Loading";

import type { useReligionApi } from "@/modules/religion/presentation/hooks/useReligionApi";
import type { Religion } from "@/modules/religion/domain/entity/Religion";

interface Props {
  api: ReturnType<typeof useReligionApi>;
}

export default function ReligionTable({ api }: Props) {
  const { religions, loading, error, deleteReligion } = api;

  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* =============================
       DELETE
    ============================= */
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteReligion(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <Table wrapperClassName="rounded-xl shadow-sm overflow-hidden">
        <TableHead className="bg-gray-100 border-b h-16">
          <tr>
            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
              No
            </TableHeaderCell>
            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
              Kode
            </TableHeaderCell>
            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
              Nama Agama
            </TableHeaderCell>
            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
              Aksi
            </TableHeaderCell>
          </tr>
        </TableHead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>
                <div className="py-10">
                  <Loading />
                </div>
              </td>
            </tr>
          ) : religions.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Tidak ada data agama
              </td>
            </tr>
          ) : (
            religions.map((item: Religion, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-gray-500 font-medium">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">{item.kode}</TableCell>

                <TableCell>{item.name}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="text"
                      size="md"
                      color="primary"
                      leftIcon={FiEdit}
                      iconOnly
                    />

                    <Button
                      variant="text"
                      size="md"
                      color="error"
                      leftIcon={FiTrash2}
                      iconOnly
                      onClick={() => setDeleteId(item.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        title="Konfirmasi Hapus"
        subtitle="Tindakan ini tidak dapat dibatalkan."
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        submitText="Hapus"
        submitColor="error"
        size="sm"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <div className="h-6 w-6 rounded-full bg-red-500" />
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus data ini?
            <br />
            Data yang dihapus tidak dapat dikembalikan.
          </p>
        </div>
      </Modal>
    </>
  );
}
