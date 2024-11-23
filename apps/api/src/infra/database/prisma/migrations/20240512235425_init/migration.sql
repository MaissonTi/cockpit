-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "from_account_id" INTEGER NOT NULL,
    "to_account_id" INTEGER,
    "type_transactions" INTEGER NOT NULL,
    "type_operations" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "old_balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "new_balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_document_key" ON "account"("document");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "from_account_id_key" FOREIGN KEY ("from_account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "to_account_id_key" FOREIGN KEY ("to_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
