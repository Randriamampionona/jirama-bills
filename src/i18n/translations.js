// All UI copy for EN / FR / MG. Add a language by adding a key here.
export const T = {
  en: {
    code: "EN",
    appTitle: "FACTURE JIRAMA",
    loginSub: "Track your monthly water & electricity index calls.",
    // nav
    navIndex: "Indexing",
    navBilling: "Billing",
    menu: "Menu",
    logout: "Sign out",
    signedInAs: "Signed in as",
    // tabs / bill
    water: "Water bills",
    electricity: "Electricity bills",
    brand: "FACTURE JIRAMA",
    period: "Billing period",
    description: "Description",
    descWater:
      "Declare your water meter index by calling 547. Once the reading is registered, mark this bill as done to keep track of the month.",
    descElec:
      "Declare your electricity meter index by calling 547. Once the reading is registered, mark this bill as done to keep track of the month.",
    ref: "Client ref",
    status: "Status",
    done: "Done",
    pending: "Not done yet",
    by: "by",
    tapHint: "Tap to update",
    cta: "Proceed to indexing call",
    account: "Account",
    address: "Address",
    accountName: "RALAMBOMANANA RANOROARISOA HAN",
    addressLine: "AV 807 Vinany Loharanombato (Ambavahady tokana)",
    // history
    history: "Indexing history",
    historyDesc: "Pick a month to see who declared each index.",
    selectMonth: "Select a month",
    noHistory: "No records yet.",
    // billing
    billingTitle: "Billing",
    billingSoon: "Volume & price details are coming here soon.",
    // system
    loadingAuth: "Loading…",
    configNeeded:
      "Firebase isn't configured yet. Add your keys to .env, then restart.",
    confirmTitle: "Confirm this month's index?",
    confirmDesc:
      "This marks the reading as done and can't be undone. Only confirm once you've actually called 547 and declared your index.",
    confirmYes: "Confirm",
    confirmNo: "Cancel",
  },
  fr: {
    code: "FR",
    appTitle: "FACTURE JIRAMA",
    loginSub: "Suivez vos relevés mensuels d'eau et d'électricité.",
    navIndex: "Indexation",
    navBilling: "Facturation",
    menu: "Menu",
    logout: "Déconnexion",
    signedInAs: "Connecté en tant que",
    water: "Factures eau",
    electricity: "Factures électricité",
    brand: "FACTURE JIRAMA",
    period: "Période de facturation",
    description: "Description",
    descWater:
      "Déclarez l'index de votre compteur d'eau en appelant le 547. Une fois le relevé enregistré, marquez cette facture comme effectuée pour suivre le mois.",
    descElec:
      "Déclarez l'index de votre compteur d'électricité en appelant le 547. Une fois le relevé enregistré, marquez cette facture comme effectuée pour suivre le mois.",
    ref: "Réf. client",
    status: "Statut",
    done: "Effectué",
    pending: "Pas encore fait",
    by: "par",
    tapHint: "Appuyez pour modifier",
    cta: "Lancer l'appel de relevé",
    account: "Compte",
    address: "Adresse",
    accountName: "RALAMBOMANANA RANOROARISOA HAN",
    addressLine: "AV 807 Vinany Loharanombato (Ambavahady tokana)",
    history: "Historique des relevés",
    historyDesc: "Choisissez un mois pour voir qui a déclaré chaque index.",
    selectMonth: "Choisir un mois",
    noHistory: "Aucun enregistrement pour l'instant.",
    billingTitle: "Facturation",
    billingSoon: "Le détail volume & prix arrivera ici bientôt.",
    loadingAuth: "Chargement…",
    configNeeded:
      "Firebase n'est pas encore configuré. Ajoutez vos clés dans .env, puis redémarrez.",
    confirmTitle: "Confirmer le relevé du mois ?",
    confirmDesc:
      "Ceci marque le relevé comme effectué et ne peut pas être annulé. Ne confirmez qu'une fois le 547 appelé et votre index déclaré.",
    confirmYes: "Confirmer",
    confirmNo: "Annuler",
  },
  mg: {
    code: "MG",
    appTitle: "FAKTIORA JIRAMA",
    loginSub: "Araho ny fandraisana isa rano sy herinaratra isam-bolana.",
    navIndex: "Fandraisana isa",
    navBilling: "Faktiora",
    menu: "Karazana",
    logout: "Hivoaka",
    signedInAs: "Tafiditra amin'ny anaran'i",
    water: "Faktioran'ny rano",
    electricity: "Faktioran'ny herinaratra",
    brand: "FAKTIORA JIRAMA",
    period: "Vanim-potoana",
    description: "Famaritana",
    descWater:
      "Ambarao ny isan'ny kompteran-dranonao amin'ny fiantsoana ny 547. Rehefa voarakitra ny isa, mariho ho vita ity faktiora ity mba hanaraha-maso ny volana.",
    descElec:
      "Ambarao ny isan'ny kompteran-herinaratrao amin'ny fiantsoana ny 547. Rehefa voarakitra ny isa, mariho ho vita ity faktiora ity mba hanaraha-maso ny volana.",
    ref: "Laharan'ny mpanjifa",
    status: "Sata",
    done: "Vita",
    pending: "Tsy mbola vita",
    by: "nataon'i",
    tapHint: "Tsindrio hanova",
    cta: "Antsoy ho an'ny fandraisana isa",
    account: "Kaonty",
    address: "Adiresy",
    accountName: "RALAMBOMANANA RANOROARISOA HAN",
    addressLine: "AV 807 Vinany Loharanombato (Ambavahady tokana)",
    history: "Tantaran'ny fandraisana isa",
    selectMonth: "Mifidiana volana",
    historyDesc: "Mifidiana volana hijerena izay nandray ny isa.",
    noHistory: "Mbola tsy misy firaketana.",
    billingTitle: "Faktiora",
    billingSoon:
      "Ho avy tsy ho ela eto ny antsipirian'ny habetsahana sy vidiny.",
    loadingAuth: "Eo am-pakàna…",
    configNeeded:
      "Mbola tsy voaomana ny Firebase. Ampidiro ao amin'ny .env ny lakilenao, avy eo avereno alefa.",
    confirmTitle: "Hamafiso ny isa amin'ity volana ity?",
    confirmDesc:
      "Manamarika ny isa ho vita izany ary tsy azo ovaina intsony. Aza hamafisina raha tsy efa niantso ny 547 sy nanambara ny isanao.",
    confirmYes: "Hamafisina",
    confirmNo: "Lavina",
  },
};

export const MONTHS = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  fr: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
  mg: [
    "Janoary",
    "Febroary",
    "Martsa",
    "Aprily",
    "Mey",
    "Jona",
    "Jolay",
    "Aogositra",
    "Septambra",
    "Oktobra",
    "Novambra",
    "Desambra",
  ],
};

// "MM/YYYY" -> localized "September 2026"
export function labelMonth(dateStr, lang) {
  if (!dateStr) return "";
  const [mm, yyyy] = dateStr.split("/");
  const name = MONTHS[lang][Number(mm) - 1] || mm;
  return `${name} ${yyyy}`;
}
