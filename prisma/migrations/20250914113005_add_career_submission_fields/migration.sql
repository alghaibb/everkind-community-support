/*
  Warnings:

  - You are about to drop the column `message` on the `career_submission` table. All the data in the column will be lost.
  - Added the required column `availability` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cert3IndividualSupport` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `covidVaccinations` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstAidCPR` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `influenzaVaccination` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ndisModules` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ndisScreeningCheck` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policeCheck` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingRights` to the `career_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingWithChildrenCheck` to the `career_submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."career_submission" DROP COLUMN "message",
ADD COLUMN     "availability" TEXT NOT NULL,
ADD COLUMN     "cert3IndividualSupport" TEXT NOT NULL,
ADD COLUMN     "certificates" TEXT,
ADD COLUMN     "covidVaccinations" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "firstAidCPR" TEXT NOT NULL,
ADD COLUMN     "influenzaVaccination" TEXT NOT NULL,
ADD COLUMN     "ndisModules" TEXT NOT NULL,
ADD COLUMN     "ndisScreeningCheck" TEXT NOT NULL,
ADD COLUMN     "policeCheck" TEXT NOT NULL,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "workingRights" TEXT NOT NULL,
ADD COLUMN     "workingWithChildrenCheck" TEXT NOT NULL;
