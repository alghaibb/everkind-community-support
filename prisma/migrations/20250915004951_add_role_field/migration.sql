/*
  Warnings:

  - Added the required column `role` to the `career_submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "public"."career_submission" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Support Worker';
