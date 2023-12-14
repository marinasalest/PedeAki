/*
  Warnings:

  - You are about to drop the column `categoria` on the `restaurantes` table. All the data in the column will be lost.
  - Added the required column `id_categoria` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "produtos" ADD COLUMN     "id_categoria" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "restaurantes" DROP COLUMN "categoria";

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
