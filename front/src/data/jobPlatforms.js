// Recherche externe : plutot que de stocker des offres en base (invariablement
// obsoletes), on genere des liens de recherche pre-remplis vers des plateformes
// specialisees. Les parametres de requete ci-dessous ont ete verifies manuellement
// (recherche reelle sur chaque site) sauf mention contraire.

function buildUrl(base, params) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

export function getJobPlatformLinks({ field, type }) {
  const keywords = [field, type].filter(Boolean).join(" ");

  const platforms = [
    {
      name: "Indeed",
      description: "Le plus grand moteur de recherche d'offres généraliste.",
      url: buildUrl("https://fr.indeed.com/jobs", { q: keywords }),
    },
    {
      name: "HelloWork",
      description: "Offres d'emploi, stages et alternances tous secteurs.",
      url: buildUrl("https://www.hellowork.com/fr-fr/emploi/recherche.html", { k: keywords }),
    },
    {
      name: "Apec",
      description: "Association Pour l'Emploi des Cadres — profils qualifiés.",
      url: buildUrl("https://www.apec.fr/candidat/recherche-emploi.html/emploi", { motsCles: keywords }),
    },
    {
      name: "JobTeaser",
      description: "Plateforme dédiée aux étudiants et jeunes diplômés.",
      url: buildUrl("https://www.jobteaser.com/fr/job-offers", { q: keywords }),
    },
    {
      name: "Welcome to the Jungle",
      description: "Offres avec un focus sur la culture d'entreprise.",
      url: buildUrl("https://www.welcometothejungle.com/fr/jobs", { query: keywords }),
      note: "Ce site fonctionne désormais par mise en relation : la recherche peut ne pas être pré-filtrée.",
    },
  ];

  // La Bonne Alternance ne recense que des offres en alternance/apprentissage.
  if (type === "alternance") {
    platforms.splice(0, 0, {
      name: "La Bonne Alternance",
      description: "Le service officiel de l'État pour trouver une alternance.",
      url: buildUrl("https://labonnealternance.apprentissage.beta.gouv.fr/recherche", {
        display: "list",
        page: "fiche",
        type: "lba",
        job: field,
      }),
    });
  }

  return platforms;
}
