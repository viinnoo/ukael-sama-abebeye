/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `isAvailable`,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;
