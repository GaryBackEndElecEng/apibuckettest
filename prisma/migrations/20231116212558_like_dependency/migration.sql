/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_id_name_key" ON "Like"("id", "name");
