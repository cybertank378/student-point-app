//Files: src/sections/student/molecules/StudentOverviewTab.tsx
"use client";

import { bool, getHouseOwnershipLabel } from "@/libs/utils";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import StudentInfoCard from "@/sections/student/atomic/StudentInfoCard";
import StudentInfoRow from "@/sections/student/atomic/StundetInfoRow";
import Divider from "@/shared-ui/component/Divider";

interface Props {
  student: StudentCompositeDTO | null;
}

export default function StudentOverviewTab({ student }: Props) {
  const profile = student?.profile;
  const facility = student?.facility;
  const health = student?.health;
  const religion = student?.religionActivity;
  const family = student?.family;
  const aids = student?.aids?.[0];

  console.log("data", aids);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StudentInfoCard title="Profil Siswa">
        <StudentInfoRow label="Anak Ke" value={profile?.childOrder} />
        <StudentInfoRow label="Jumlah Saudara" value={profile?.totalSiblings} />
        <StudentInfoRow label="Jarak ke Sekolah" value={profile?.distanceToSchool} />
        <StudentInfoRow label="Transportasi" value={profile?.transport} />
        <StudentInfoRow label="Hobi" value={profile?.hobby} />
        <StudentInfoRow label="Cita-cita" value={profile?.dream} />
        <StudentInfoRow label="Teman Dekat" value={profile?.closeFriend} />
      </StudentInfoCard>

      <StudentInfoCard title="Fasilitas Belajar">
        <StudentInfoRow label="PC" value={bool(facility?.hasPC)} />
        <StudentInfoRow label="Laptop" value={bool(facility?.hasLaptop)} />
        <StudentInfoRow label="HP" value={bool(facility?.hasPhone)} />
        <StudentInfoRow label="Internet" value={facility?.internetAccess} />
      </StudentInfoCard>

      <StudentInfoCard title="Kesehatan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COLUMN 1 */}
          <div className="space-y-2 border-r pr-6">
            <StudentInfoRow label="Inklusi" value={bool(health?.inclusion)} />
            <StudentInfoRow label="Bisa Menulis" value={bool(health?.canWrite)} />
            <StudentInfoRow label="Bisa Berbicara" value={bool(health?.canSpeak)} />
            <StudentInfoRow label="Bisa Olahraga" value={bool(health?.canDoSport)} />
            <StudentInfoRow label="Pendengaran Baik" value={bool(health?.canHearClearly)} />
            <StudentInfoRow label="Memegang Pena" value={bool(health?.canHoldPen)} />
            <StudentInfoRow label="Riwayat Penyakit" value={health?.diseaseHistory ?? "-"} />
            <StudentInfoRow label="Tes IQ" value={bool(health?.hasIQTest)} />
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-2 pl-6">
            <StudentInfoRow label="Bisa Membaca" value={bool(health?.canRead)} />
            <StudentInfoRow label="Bisa Menghitung" value={bool(health?.canCount)} />
            <StudentInfoRow label="Mengikuti Upacara" value={bool(health?.canFollowCeremony)} />
            <StudentInfoRow label="Melihat Papan Tulis" value={bool(health?.canSeeBoard)} />
            <StudentInfoRow label="Berjalan / Berlari" value={bool(health?.canWalkRun)} />
            <StudentInfoRow label="Tangan Dominan Kanan" value={bool(health?.dominantHandRight)} />
            <StudentInfoRow label="Surat Psikolog" value={bool(health?.hasPsychologistLetter)} />
            <StudentInfoRow label="IQ Score" value={health?.iqScore ?? "-"} />
          </div>
        </div>
      </StudentInfoCard>

      <StudentInfoCard title="Kegiatan Agama">
        <StudentInfoRow label="Shalat 5 Waktu" value={bool(religion?.prayFiveTimes)} />
        <StudentInfoRow label="Frekuensi Meninggalkan Shalat" value={religion?.oftenMissPrayer} />
        <StudentInfoRow label="Tingkat Mengaji" value={religion?.quranStudyLevel} />
        <StudentInfoRow label="Kegiatan Keagamaan" value={religion?.worshipActivities} />
        <StudentInfoRow label="Tempat Ibadah" value={religion?.worshipLocation} />
      </StudentInfoCard>

      <StudentInfoCard title="Keluarga">
        <StudentInfoRow label="Tinggal Dengan" value={family?.livingWith} />
        <StudentInfoRow label="Status Rumah" value={getHouseOwnershipLabel(family?.houseOwnership)} />
        <StudentInfoRow label="Kepala Keluarga" value={family?.headOfFamilyName} />
      </StudentInfoCard>
      <StudentInfoCard title="Bantuan Pemerintah">
        <StudentInfoRow label="Kartu Jakarta Pintar" value={bool(aids?.kjp)} />
        <StudentInfoRow label="Program Indonesia Pintar" value={bool(aids?.pip)} />
      </StudentInfoCard>
    </div>
  );
}
