-- CreateTable
CREATE TABLE "StakeholderSetting" (
    "id" TEXT NOT NULL,
    "referencePricePerLiter" DOUBLE PRECISION NOT NULL,
    "receptionLocationName" TEXT NOT NULL,
    "receptionAddress" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "updatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakeholderSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StakeholderSetting" ADD CONSTRAINT "StakeholderSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
