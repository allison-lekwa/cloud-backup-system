-- CreateTable
CREATE TABLE "core_file" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "userId" UUID,
    "url" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,
    "eTag" VARCHAR,
    "bucket" VARCHAR,
    "isSafe" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_file_key_key" ON "core_file"("key");

-- AddForeignKey
ALTER TABLE "core_file" ADD CONSTRAINT "core_file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
