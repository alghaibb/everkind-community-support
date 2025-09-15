/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `career_submission` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `availability` on the `career_submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."career_submission" DROP COLUMN "availability",
ADD COLUMN     "availability" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "career_submission_email_key" ON "public"."career_submission"("email");
