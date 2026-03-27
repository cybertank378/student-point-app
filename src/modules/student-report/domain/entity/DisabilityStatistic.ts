//Files: src/modules/student-report/domain/DisabilityStatistic.ts
/**
 * ============================================================
 * ENTITY: DISABILITY STATISTIC
 * ============================================================
 *
 * Entity ini merepresentasikan statistik siswa difabel
 * pada sistem sekolah.
 *
 * Statistik ini digunakan untuk analytics dashboard.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param difableStudents jumlah siswa difabel
 * @param totalStudents jumlah seluruh siswa
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * persentase siswa difabel terhadap total siswa
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const stat = new DisabilityStatistic(10, 500)
 *
 */

export class DisabilityStatistic {
  constructor(
    public readonly difableStudents: number,
    public readonly totalStudents: number
  ) {}

  get percentage(): number {
    if (this.totalStudents === 0) return 0;

    return (this.difableStudents / this.totalStudents) * 100;
  }
}
