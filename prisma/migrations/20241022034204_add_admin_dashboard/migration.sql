-- CreateTable
CREATE TABLE "AdminDashboard" (
    "id" SERIAL NOT NULL,
    "toggleOpenClose" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminDashboard_pkey" PRIMARY KEY ("id")
);
