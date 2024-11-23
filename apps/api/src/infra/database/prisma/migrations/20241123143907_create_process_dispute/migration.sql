/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "from_account_id_key";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "to_account_id_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'COMMON';

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "transaction";

-- CreateTable
CREATE TABLE "process_disputes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "admin_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "process_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_disputes_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "process_disputes_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "process_disputes_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "duration_time" INTEGER NOT NULL DEFAULT 120,
    "winner_user_id" TEXT,
    "winner_value" DOUBLE PRECISION DEFAULT 0.0,
    "process_disputes_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_throw" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "batch_id" TEXT NOT NULL,
    "user_id" TEXT,
    "value" DOUBLE PRECISION DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "batch_throw_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "process_disputes_users" ADD CONSTRAINT "process_disputes_id_key" FOREIGN KEY ("process_disputes_id") REFERENCES "process_disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_disputes_users" ADD CONSTRAINT "user_id_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "process_disputes_id_key" FOREIGN KEY ("process_disputes_id") REFERENCES "process_disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_throw" ADD CONSTRAINT "batch_id_key" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
