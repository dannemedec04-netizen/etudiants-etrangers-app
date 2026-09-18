const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
  // Ordre de suppression respectant les contraintes de cle etrangere
  await prisma.checklistItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.aid.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.school.deleteMany();

  const schoolDefs = [
    { key: "saclay", name: "Universite Paris-Saclay", city: "Paris", website: "https://www.universite-paris-saclay.fr" },
    { key: "iutLyon", name: "IUT de Lyon 1", city: "Lyon", website: "https://iut.univ-lyon1.fr" },
    { key: "essca", name: "ESSCA School of Management", city: "Angers", website: "https://www.essca.fr" },
    { key: "toulouse", name: "Universite Toulouse Capitole", city: "Toulouse", website: "https://ut-capitole.fr" },
    { key: "iutLille", name: "IUT de Lille", city: "Lille", website: "https://iutlille.univ-lille.fr" },
    { key: "emLyon", name: "EM Lyon Business School", city: "Lyon", website: "https://www.em-lyon.com" },
    { key: "bordeaux", name: "Universite de Bordeaux", city: "Bordeaux", website: "https://www.u-bordeaux.fr" },
    { key: "nantes", name: "Universite de Nantes", city: "Nantes", website: "https://www.univ-nantes.fr" },
    { key: "sciencesPoStrasbourg", name: "Sciences Po Strasbourg", city: "Strasbourg", website: "https://www.sciencespo-strasbourg.fr" },
    { key: "grenobleInp", name: "Institut Polytechnique de Grenoble", city: "Grenoble", website: "https://www.grenoble-inp.fr" },
    { key: "montpellier", name: "Universite de Montpellier", city: "Montpellier", website: "https://www.umontpellier.fr" },
    { key: "iutMarseille", name: "IUT d'Aix-Marseille", city: "Marseille", website: "https://iut.univ-amu.fr" },
  ];

  const schools = {};
  for (const def of schoolDefs) {
    schools[def.key] = await prisma.school.create({
      data: { name: def.name, city: def.city, website: def.website },
    });
  }

  await prisma.formation.createMany({
    data: [
      // Universite Paris-Saclay - Paris
      {
        title: "Master Informatique - Intelligence Artificielle",
        description: "Formation initiale en 2 ans, specialisation IA et data science.",
        type: "initiale",
        field: "Informatique",
        schoolId: schools.saclay.id,
      },
      {
        title: "Licence Droit international",
        description: "Licence generaliste avec ouverture sur le droit international.",
        type: "initiale",
        field: "Droit",
        schoolId: schools.saclay.id,
      },
      {
        title: "Licence Sciences pour la Sante",
        description: "Premier cycle pluridisciplinaire ouvrant vers les filieres de sante.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.saclay.id,
      },

      // IUT de Lyon 1 - Lyon
      {
        title: "BUT Informatique en alternance",
        description: "Bachelor universitaire de technologie, rythme alternance 3 semaines / 1 semaine.",
        type: "alternance",
        field: "Informatique",
        schoolId: schools.iutLyon.id,
      },
      {
        title: "BTS Commerce International",
        description: "Formation en alternance orientee commerce et negociation a l'international.",
        type: "alternance",
        field: "Commerce",
        schoolId: schools.iutLyon.id,
      },
      {
        title: "BUT Genie Biologique - option Sciences de la Sante",
        description: "Formation initiale en 3 ans autour des sciences biologiques et paramedicales.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.iutLyon.id,
      },

      // ESSCA School of Management - Angers
      {
        title: "Programme Grande Ecole - Commerce",
        description: "Cursus en 3 ans, formation initiale avec un semestre a l'international.",
        type: "initiale",
        field: "Commerce",
        schoolId: schools.essca.id,
      },
      {
        title: "Mastere Marketing Digital en alternance",
        description: "Mastere specialise en marketing digital, alternance sur 12 mois.",
        type: "alternance",
        field: "Commerce",
        schoolId: schools.essca.id,
      },

      // Universite Toulouse Capitole - Toulouse
      {
        title: "Licence Droit",
        description: "Licence generaliste en droit prive et droit public.",
        type: "initiale",
        field: "Droit",
        schoolId: schools.toulouse.id,
      },
      {
        title: "Master Droit des Affaires en alternance",
        description: "Master 2 en alternance, specialisation droit des societes et contrats.",
        type: "alternance",
        field: "Droit",
        schoolId: schools.toulouse.id,
      },
      {
        title: "Licence Economie-Gestion",
        description: "Formation initiale generaliste en economie et gestion des entreprises.",
        type: "initiale",
        field: "Commerce",
        schoolId: schools.toulouse.id,
      },

      // IUT de Lille - Lille
      {
        title: "BUT Informatique",
        description: "Formation initiale en 3 ans, developpement logiciel et reseaux.",
        type: "initiale",
        field: "Informatique",
        schoolId: schools.iutLille.id,
      },
      {
        title: "BUT Techniques de Commercialisation en alternance",
        description: "Alternance orientee vente, marketing et negociation commerciale.",
        type: "alternance",
        field: "Commerce",
        schoolId: schools.iutLille.id,
      },

      // EM Lyon Business School - Lyon
      {
        title: "Programme Grande Ecole Management",
        description: "Cursus en 3 ans, formation initiale en management general.",
        type: "initiale",
        field: "Commerce",
        schoolId: schools.emLyon.id,
      },
      {
        title: "MSc International Business en alternance",
        description: "Mastere specialise en commerce international, alternance sur 12 a 24 mois.",
        type: "alternance",
        field: "Commerce",
        schoolId: schools.emLyon.id,
      },

      // Universite de Bordeaux - Bordeaux
      {
        title: "Licence Droit",
        description: "Licence generaliste en droit, tronc commun les deux premieres annees.",
        type: "initiale",
        field: "Droit",
        schoolId: schools.bordeaux.id,
      },
      {
        title: "PASS - Parcours Acces Sante Specifique",
        description: "Premiere annee commune donnant acces aux etudes de medecine, pharmacie, dentaire et sage-femme.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.bordeaux.id,
      },
      {
        title: "Master Informatique - Cybersecurite en alternance",
        description: "Master 2 en alternance, specialisation securite des systemes d'information.",
        type: "alternance",
        field: "Informatique",
        schoolId: schools.bordeaux.id,
      },

      // Universite de Nantes - Nantes
      {
        title: "Licence Informatique",
        description: "Formation initiale generaliste en developpement et algorithmique.",
        type: "initiale",
        field: "Informatique",
        schoolId: schools.nantes.id,
      },
      {
        title: "Licence Sciences Sanitaires et Sociales",
        description: "Formation initiale preparant aux metiers du secteur medico-social.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.nantes.id,
      },

      // Sciences Po Strasbourg - Strasbourg
      {
        title: "Diplome Sciences Po - mention Droit public",
        description: "Cursus en 5 ans, formation initiale pluridisciplinaire orientee droit public.",
        type: "initiale",
        field: "Droit",
        schoolId: schools.sciencesPoStrasbourg.id,
      },
      {
        title: "Master Affaires Europeennes en alternance",
        description: "Master 2 en alternance sur les politiques et le droit de l'Union europeenne.",
        type: "alternance",
        field: "Droit",
        schoolId: schools.sciencesPoStrasbourg.id,
      },

      // Institut Polytechnique de Grenoble - Grenoble
      {
        title: "Diplome d'Ingenieur Informatique",
        description: "Formation initiale en 5 ans, cursus ingenieur generaliste informatique.",
        type: "initiale",
        field: "Informatique",
        schoolId: schools.grenobleInp.id,
      },
      {
        title: "Master Informatique - Data Science en alternance",
        description: "Master 2 en alternance, specialisation science des donnees et machine learning.",
        type: "alternance",
        field: "Informatique",
        schoolId: schools.grenobleInp.id,
      },

      // Universite de Montpellier - Montpellier
      {
        title: "PASS - Parcours Acces Sante Specifique",
        description: "Premiere annee commune donnant acces aux etudes de sante.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.montpellier.id,
      },
      {
        title: "Master Sante Publique",
        description: "Formation initiale en 2 ans, epidemiologie et politiques de sante.",
        type: "initiale",
        field: "Santé",
        schoolId: schools.montpellier.id,
      },
      {
        title: "Licence Droit",
        description: "Licence generaliste en droit prive et droit public.",
        type: "initiale",
        field: "Droit",
        schoolId: schools.montpellier.id,
      },

      // IUT d'Aix-Marseille - Marseille
      {
        title: "BUT Gestion des Entreprises et des Administrations en alternance",
        description: "Alternance en gestion, comptabilite et pilotage de la performance.",
        type: "alternance",
        field: "Commerce",
        schoolId: schools.iutMarseille.id,
      },
      {
        title: "BUT Informatique",
        description: "Formation initiale en 3 ans, developpement logiciel et reseaux.",
        type: "initiale",
        field: "Informatique",
        schoolId: schools.iutMarseille.id,
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
      {
        name: "Visale - Garantie Loyer",
        provider: "Action Logement",
        category: "logement",
        description: "Caution locative gratuite qui couvre les loyers impayes aupres du proprietaire.",
        eligibility: "Etudiant ou jeune de moins de 30 ans, salarie precaire.",
        amount: "Prise en charge des loyers impayes dans la limite du plafond du contrat",
        url: "https://www.visale.fr",
      },
      {
        name: "Cheque Energie",
        provider: "Ministere de la Transition Ecologique",
        category: "logement",
        description: "Aide au paiement des factures d'energie du logement (electricite, gaz, chauffage).",
        eligibility: "Conditions de ressources du foyer fiscal.",
        amount: "En moyenne 150 euros par an",
        url: "https://www.chequeenergie.gouv.fr",
      },
      {
        name: "Bourse Eiffel",
        provider: "Campus France",
        category: "bourse",
        description: "Bourse d'excellence pour etudiants internationaux admis en master ou doctorat en France.",
        eligibility: "Etudiant etranger, admission dans un etablissement partenaire, criteres d'excellence academique.",
        amount: "1181 euros par mois en master, 1400 euros par mois en doctorat",
        url: "https://www.campusfrance.org",
      },
      {
        name: "Aide a la Mobilite Erasmus+",
        provider: "Agence Erasmus+ France",
        category: "bourse",
        description: "Aide financiere pour un semestre d'etudes ou un stage dans un pays partenaire europeen.",
        eligibility: "Etre inscrit dans un etablissement participant au programme Erasmus+.",
        amount: "Variable selon le pays de destination et la duree du sejour",
        url: "https://www.erasmusplus.fr",
      },
      {
        name: "Aide Specifique d'Urgence",
        provider: "CROUS",
        category: "bourse",
        description: "Aide ponctuelle ou annuelle pour les etudiants en situation financiere difficile.",
        eligibility: "Rupture familiale ou changement brutal de situation personnelle ou financiere.",
        amount: "Jusqu'a 3000 euros selon la situation",
        url: "https://www.etudiant.gouv.fr",
      },
      {
        name: "Carte Avantage Jeune",
        provider: "SNCF",
        category: "transport",
        description: "Reduction jusqu'a 30% sur les billets de train pour les moins de 27 ans.",
        eligibility: "Avoir moins de 27 ans.",
        amount: "49 euros par an, jusqu'a 30% de reduction sur les trajets",
        url: "https://www.sncf-connect.com",
      },
      {
        name: "Forfait Navigo tarif reduit",
        provider: "Ile-de-France Mobilites",
        category: "transport",
        description: "Tarif reduit sur l'abonnement de transport en commun pour les etudiants boursiers d'Ile-de-France.",
        eligibility: "Etudiant boursier residant ou etudiant en Ile-de-France.",
        amount: "Reduction sur le prix de l'abonnement annuel",
        url: "https://www.iledefrance-mobilites.fr",
      },
      {
        name: "Sante Psy Etudiant",
        provider: "Ministere de l'Enseignement Superieur et de la Recherche",
        category: "sante",
        description: "Consultations psychologiques gratuites pour tous les etudiants, sans avance de frais.",
        eligibility: "Etre inscrit dans un etablissement d'enseignement superieur francais.",
        amount: "Jusqu'a 12 seances gratuites par annee universitaire",
        url: "https://www.santepsy.etudiant.gouv.fr",
      },
      {
        name: "Renouvellement du titre de sejour",
        provider: "Prefecture",
        category: "titre_de_sejour",
        description: "Demarche a effectuer avant l'expiration du titre de sejour pour continuer a etudier legalement en France.",
        eligibility: "Etudiant etranger dont le titre de sejour arrive a expiration, demarche a anticiper 2 a 4 mois avant.",
        amount: "Timbre fiscal, montant variable selon le type de titre",
        url: "https://administration-etrangers-en-france.interieur.gouv.fr",
      },
    ],
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo.etudiant@example.com",
      passwordHash: await bcrypt.hash("changeme", 10),
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
        url: "https://administration-etrangers-en-france.interieur.gouv.fr",
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

  console.log(
    `Seed termine : ${schoolDefs.length} ecoles, 29 formations, 13 aides, 1 utilisateur demo avec 3 etapes de checklist.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
