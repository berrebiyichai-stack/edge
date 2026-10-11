/**
 * Edge : passerelle privée entre le Google Sheet "Journal de trading" et l'appli.
 * À coller dans Extensions > Apps Script du Sheet (voir README.md).
 * Renvoie les lignes de l'onglet Trades uniquement si la clé envoyée est la bonne.
 */

// Choisis une clé longue et unique, et ne la mets jamais sur GitHub.
const CLE_SECRETE = 'REMPLACE-MOI-PAR-UNE-CLE-LONGUE';

function doPost(e) {
  let corps = {};
  try {
    corps = JSON.parse(e.postData.contents);
  } catch (err) {
    return repondre({ erreur: 'Requête invalide' });
  }
  if (CLE_SECRETE.indexOf('REMPLACE-MOI') === 0 || corps.cle !== CLE_SECRETE) {
    return repondre({ erreur: 'Clé invalide' });
  }

  const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Trades');
  const valeurs = feuille.getDataRange().getValues();
  const entetes = valeurs.shift();
  const fuseau = Session.getScriptTimeZone();

  const trades = valeurs
    .filter(ligne => ligne[0] !== '')
    .map(ligne => {
      const trade = {};
      entetes.forEach((nom, i) => {
        const v = ligne[i];
        trade[nom] = v instanceof Date ? Utilities.formatDate(v, fuseau, 'dd/MM/yyyy HH:mm') : v;
      });
      return trade;
    });

  return repondre({ trades: trades });
}

function repondre(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}
