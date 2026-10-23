CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'ONLINE');

CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

CREATE INDEX "Payment_status_idx" ON "Payment"("status");

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
