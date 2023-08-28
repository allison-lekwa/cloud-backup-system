-- CreateTable
CREATE TABLE "core_file_directory" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_file_directory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_file_directory_userId_key" ON "core_file_directory"("userId");

-- AddForeignKey
ALTER TABLE "core_file_directory" ADD CONSTRAINT "core_file_directory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
