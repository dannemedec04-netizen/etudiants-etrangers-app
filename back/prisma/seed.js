const prisma = require("../src/prisma");

async function main() {
  // Ordre de suppression respectant les contraintes de cle etrangere
  await prisma.formation.deleteMany();
  await prisma.jobOffer.deleteMany();
  await prisma.school.deleteMany();

  const [saclay, iutLyon, essca] = await Promise.all([
    prisma.school.create({
      data: { name: "Universite Paris-Saclay", city: "Paris" },
    }),
    prisma.school.create({
      data: { name: "IUT de Lyon 1", city: "Lyon" },
    }),
    prisma.school.create({
      data: { name: "ESSCA School of Management", city: "Angers" },
    }),
  ]);

  await prisma.formation.createMany({
    data: [
      {
        title: "Master Informatique - Intelligence Artificielle",
        description: "Formation initiale en 2 ans, specialisation IA et data science.",
        type: "initiale",
        field: "Informatique",
        schoolId: saclay.id,
      },
      {
        title: "Licence Droit international",
        description: "Licence generaliste avec ouverture sur le droit international.",
        type: "initiale",
        field: "Droit",
        schoolId: saclay.id,
      },
      {
        title: "BUT Informatique en alternance",
        description: "Bachelor universitaire de technologie, rythme alternance 3 semaines / 1 semaine.",
        type: "alternance",
        field: "Informatique",
        schoolId: iutLyon.id,
      },
      {
        title: "BTS Commerce International",
        description: "Formation en alternance orientee commerce et negociation a l'international.",
        type: "alternance",
        field: "Commerce",
        schoolId: iutLyon.id,
      },
      {
        title: "Programme Grande Ecole - Commerce",
        description: "Cursus en 3 ans, formation initiale avec un semestre a l'international.",
        type: "initiale",
        field: "Commerce",
        schoolId: essca.id,
      },
      {
        title: "Mastere Marketing Digital en alternance",
        description: "Mastere specialise en marketing digital, alternance sur 12 mois.",
        type: "alternance",
        field: "Commerce",
        schoolId: essca.id,
      },
    ],
  });

  await prisma.jobOffer.createMany({
    data: [
      {
        title: "Developpeur Full-Stack Junior",
        company: "TechCorp",
        type: "alternance",
        field: "Informatique",
        location: "Lyon",
        description: "Alternance 12 mois sur une stack Node.js / React.",
      },
      {
        title: "Data Analyst",
        company: "OVHcloud",
        type: "alternance",
        field: "Informatique",
        location: "Roubaix",
        description: "Alternance au sein de l'equipe data, analyse de la performance produit.",
      },
      {
        title: "Assistant(e) Commercial(e)",
        company: "Groupe Carrefour",
        type: "stage",
        field: "Commerce",
        location: "Paris",
        description: "Stage de 6 mois au sein de l'equipe commerciale grands comptes.",
      },
      {
        title: "Juriste Junior - Droit des Affaires",
        company: "Cabinet Dupont & Associes",
        type: "stage",
        field: "Droit",
        location: "Paris",
        description: "Stage de 4 mois, redaction et suivi de dossiers en droit des affaires.",
      },
    ],
  });

  console.log("Seed termine : 3 ecoles, 6 formations, 4 offres.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
