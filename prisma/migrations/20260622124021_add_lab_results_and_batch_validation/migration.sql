-- CreateEnum
CREATE TYPE "LabGrade" AS ENUM ('A', 'B', 'C', 'REJECT');

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "waterContentPercent" DOUBLE PRECISION NOT NULL,
    "ffaPercent" DOUBLE PRECISION NOT NULL,
    "impurityPercent" DOUBLE PRECISION NOT NULL,
    "grade" "LabGrade" NOT NULL,
    "notes" TEXT,
    "testedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_batchId_key" ON "LabResult"("batchId");

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "CollectorBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_testedById_fkey" FOREIGN KEY ("testedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
