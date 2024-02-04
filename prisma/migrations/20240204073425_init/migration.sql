/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_CompanyToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToProfile_AB_unique" ON "_CompanyToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToProfile_B_index" ON "_CompanyToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Job_companyId_key" ON "Job"("companyId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToProfile" ADD CONSTRAINT "_CompanyToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToProfile" ADD CONSTRAINT "_CompanyToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
