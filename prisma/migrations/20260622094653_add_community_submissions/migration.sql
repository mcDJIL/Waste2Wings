-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'ACCEPTED_BY_COLLECTOR', 'REJECTED_BY_COLLECTOR', 'IN_BATCH', 'COMPLETED');

-- CreateTable
CREATE TABLE "CommunitySubmission" (
    "id" TEXT NOT NULL,
    "communityProfileId" TEXT NOT NULL,
    "collectorProfileId" TEXT NOT NULL,
    "estimatedLiter" DOUBLE PRECISION NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "actualLiter" DOUBLE PRECISION,
    "sedimentLiter" DOUBLE PRECISION,
    "cleanLiter" DOUBLE PRECISION,
    "pricePerLiter" DOUBLE PRECISION,
    "totalPaid" DOUBLE PRECISION,
    "collectorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunitySubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunitySubmission" ADD CONSTRAINT "CommunitySubmission_communityProfileId_fkey" FOREIGN KEY ("communityProfileId") REFERENCES "CommunityProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunitySubmission" ADD CONSTRAINT "CommunitySubmission_collectorProfileId_fkey" FOREIGN KEY ("collectorProfileId") REFERENCES "CollectorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
