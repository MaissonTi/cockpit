-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COMMON',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_messagens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "destinate_id" TEXT NOT NULL,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_messagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_disputes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT DEFAULT 'PENDING',
    "is_open" BOOLEAN DEFAULT false,
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
CREATE TABLE "batch_bids" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "user_id" TEXT,
    "value" DOUBLE PRECISION DEFAULT 0.0,
    "is_decline" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "batch_bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_messagens" ADD CONSTRAINT "user_messagens_id_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_messagens" ADD CONSTRAINT "process_dispute_messagens_key" FOREIGN KEY ("destinate_id") REFERENCES "process_disputes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_disputes_users" ADD CONSTRAINT "process_disputes_id_key" FOREIGN KEY ("process_disputes_id") REFERENCES "process_disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_disputes_users" ADD CONSTRAINT "user_id_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "process_disputes_id_key" FOREIGN KEY ("process_disputes_id") REFERENCES "process_disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_bids" ADD CONSTRAINT "batch_bids_id_key" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
