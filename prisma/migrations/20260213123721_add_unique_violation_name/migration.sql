/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Violation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Violation_name_key" ON "Violation"("name");
