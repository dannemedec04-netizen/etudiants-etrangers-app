const prisma = require("../src/prisma");

async function main() {
  // Ordre de suppression respectant les contraintes de cle etrangere
  await prisma.checklistItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.aid.deleteMany();
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

  await prisma.aid.createMany({
    data: [
      {
        name: "APL - Aide Personnalisee au Logement",
        provider: "CAF",
        category: "logement",
        description: "Aide au paiement du loyer, versee chaque mois sous conditions de ressources.",
        eligibility: "Etudiant locataire, ressources sous un certain plafond.",
        amount: "Variable selon le loyer et les ressources",
        url: "https://www.caf.fr",
      },
      {
        name: "Bourse CROUS sur criteres sociaux",
        provider: "CROUS",
        category: "bourse",
        description: "Bourse annuelle versee en 10 mensualites selon la situation familiale et financiere.",
        eligibility: "Etudiant inscrit en formation initiale, conditions de ressources du foyer.",
        amount: "De 1454 a 6335 euros par an",
        url: "https://www.etudiant.gouv.fr",
      },
      {
        name: "Complementaire sante solidaire",
        provider: "Assurance Maladie",
        category: "sante",
        description: "Complementaire sante gratuite ou a faible cout pour les revenus modestes.",
        eligibility: "Residence stable en France, conditions de ressources.",
        amount: "Gratuite ou jusqu'a 1 euro par jour selon l'age",
        url: "https://www.ameli.fr",
      },
      {
        name: "Aide Mobili-Jeune",
        provider: "Action Logement",
        category: "logement",
        description: "Aide au financement du loyer pour les alternants de moins de 30 ans.",
        eligibility: "Etre en contrat d'alternance, avoir moins de 30 ans.",
        amount: "Jusqu'a 100 euros par mois",
        url: "https://www.actionlogement.fr",
      },
    ],
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo.etudiant@example.com",
      password: "changeme",
      firstName: "Amara",
      lastName: "Diallo",
      country: "Senegal",
    },
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        label: "Deposer la demande de titre de sejour",
        description: "Prendre rendez-vous en prefecture et preparer les justificatifs de domicile et de ressources.",
        category: "titre_de_sejour",
        userId: demoUser.id,
      },
      {
        label: "Faire la demande d'APL",
        description: "Demande a realiser en ligne sur le site de la CAF une fois le bail signe.",
        category: "aides",
        done: true,
        userId: demoUser.id,
      },
      {
        label: "Verifier son droit au travail etudiant",
        description: "Le nombre d'heures autorisees depend du statut et du type de titre de sejour.",
        category: "droit_au_travail",
        userId: demoUser.id,
      },
    ],
  });

  console.log("Seed termine : 3 ecoles, 6 formations, 4 offres, 4 aides, 1 utilisateur demo avec 3 etapes de checklist.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
