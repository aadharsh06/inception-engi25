-- CreateEnum
CREATE TYPE "public"."InvestmentExperience" AS ENUM ('NONE', 'BEGINNER', 'INTERMEDIATE', 'EXPERIENCED');

-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('RETIREMENT', 'LONG_TERM', 'SHORT_TERM');

-- CreateEnum
CREATE TYPE "public"."Tolerance" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Portfolio" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "portfolioJSON" JSONB NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvestmentPrefs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolio_style" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "investment_experience" "public"."InvestmentExperience" NOT NULL,
    "goal_type" "public"."GoalType" NOT NULL,
    "target_amount" DOUBLE PRECISION NOT NULL,
    "target_years" INTEGER NOT NULL,
    "risk_tolerance" "public"."Tolerance" NOT NULL,
    "volatility_tolerance" "public"."Tolerance" NOT NULL,
    "initial_investment" DOUBLE PRECISION NOT NULL,
    "liquidity_needs_percentage" DOUBLE PRECISION NOT NULL,
    "preferred_sectors" TEXT[],
    "excluded_sectors" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InvestmentPrefs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "public"."User"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentPrefs_userId_key" ON "public"."InvestmentPrefs"("userId");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Portfolio" ADD CONSTRAINT "Portfolio_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestmentPrefs" ADD CONSTRAINT "InvestmentPrefs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
