-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMMUNITY', 'COLLECTOR', 'STAKEHOLDER');

-- CreateEnum
CREATE TYPE "CommunityCategory" AS ENUM ('HOUSEHOLD', 'UMKM', 'HOTEL_RESTAURANT', 'INDUSTRY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "CommunityCategory" NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capacityLiter" DOUBLE PRECISION NOT NULL,
    "buyPricePerLiter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakeholderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakeholderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityProfile_userId_key" ON "CommunityProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectorProfile_userId_key" ON "CollectorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StakeholderProfile_userId_key" ON "StakeholderProfile"("userId");

-- AddForeignKey
ALTER TABLE "CommunityProfile" ADD CONSTRAINT "CommunityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorProfile" ADD CONSTRAINT "CollectorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderProfile" ADD CONSTRAINT "StakeholderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
