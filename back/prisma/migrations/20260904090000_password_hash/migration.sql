-- Donnees de seed uniquement (pas de donnees utilisateur reelles) : on vide les
-- tables dependantes avant de remplacer la colonne, pour eviter une violation
-- de contrainte NOT NULL sur les lignes existantes.
DELETE FROM "ChecklistItem";
DELETE FROM "User";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL;
