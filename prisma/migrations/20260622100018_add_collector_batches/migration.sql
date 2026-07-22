-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('SUBMITTED_TO_STAKEHOLDER', 'LAB_REVIEW', 'ACCEPTED_BY_STAKEHOLDER', 'REJECTED_BY_STAKEHOLDER');

-- CreateTable
CREATE TABLE "CollectorBatch" (
    "id" TEXT NOT NULL,
    "collectorProfileId" TEXT NOT NULL,
    "stakeholderSettingId" TEXT NOT NULL,
    "batchCode" TEXT NOT NULL,
    "totalCleanLiter" DOUBLE PRECISION NOT NULL,
    "requestedPricePerLiter" DOUBLE PRECISION NOT NULL,
    "estimatedTotalPrice" DOUBLE PRECISION NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'SUBMITTED_TO_STAKEHOLDER',
    "finalLiter" DOUBLE PRECISION,
    "finalTotalPrice" DOUBLE PRECISION,
    "stakeholderNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectorBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "cleanLiterAllocated" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectorBatch_batchCode_key" ON "CollectorBatch"("batchCode");

-- CreateIndex
CREATE UNIQUE INDEX "BatchItem_batchId_submissionId_key" ON "BatchItem"("batchId", "submissionId");

-- AddForeignKey
ALTER TABLE "CollectorBatch" ADD CONSTRAINT "CollectorBatch_collectorProfileId_fkey" FOREIGN KEY ("collectorProfileId") REFERENCES "CollectorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorBatch" ADD CONSTRAINT "CollectorBatch_stakeholderSettingId_fkey" FOREIGN KEY ("stakeholderSettingId") REFERENCES "StakeholderSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchItem" ADD CONSTRAINT "BatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "CollectorBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchItem" ADD CONSTRAINT "BatchItem_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "CommunitySubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
