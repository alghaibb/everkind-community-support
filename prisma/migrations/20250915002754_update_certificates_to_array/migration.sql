/*
  Warnings:

  - The `certificates` column on the `career_submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."career_submission" DROP COLUMN "certificates",
ADD COLUMN     "certificates" TEXT[];
