-- CreateTable
CREATE TABLE "core_user" (
    "id" UUID NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "lastLogin" TIMESTAMPTZ(6),
    "lastLoginIp" VARCHAR(20),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_user_hashed_password" (
    "id" UUID NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_user_hashed_password_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_user_email_key" ON "core_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "core_user_hashed_password_userId_key" ON "core_user_hashed_password"("userId");

-- AddForeignKey
ALTER TABLE "core_user_hashed_password" ADD CONSTRAINT "core_user_hashed_password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
