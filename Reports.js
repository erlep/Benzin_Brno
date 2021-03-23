// Reports.gs
//
"use strict"
// Konfigurace 28.11.2017
var cAppName = "pegBatTool:Benzín";
var cAppVerz = "v1.00";
var CrLf     = '\n';
// =============================================================================
function logProductInfo() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    Logger.log('Product name: ' + data[i][0]);
    Logger.log('Product number: ' + data[i][1]);
  }
}
// =============================================================================
function addLine() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(['Cotton Sweatshirt XL', 'css004']);
}
// =============================================================================
// Napise do bunku aktualni cas, aktualizuje tabulku - flush
function TimeNow() {
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  // Vynucena modifikace tabulky
  sheetCeny.getRange('m1').setValue(1);
  SpreadsheetApp.flush();
  // TimeNow
  sheetCeny.getRange('l2').setValue(new Date().toLocaleDateString() );
  sheetCeny.getRange('k2').setValue(new Date().toLocaleTimeString() );
  sheetCeny.getRange('m1').setValue(0);
  SpreadsheetApp.flush();
}
// =============================================================================
// Formatuje XX.XX - https://goo.gl/kNSqWH
function F2dst1(num) {
  return parseFloat(Math.round(num.replace(",",".") * 100) / 100).toFixed(2).replace(".",",");
}
function F2dst2(num) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2).replace(".",",");
}
// =============================================================================
// Udela zaznam do sheetu Logs
function t_Log() {
  // Nastaveni data
  TimeNow();
  // Vyplneni
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  var sheetLogs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');
  sheetLogs.appendRow([
    sheetCeny.getRange('k1').getValue(),
    sheetCeny.getRange('b2').getValue(),
    sheetCeny.getRange('b3').getValue(),
    sheetCeny.getRange('b4').getValue(),
    sheetCeny.getRange('b5').getValue(),
    sheetCeny.getRange('b6').getValue(),
    sheetCeny.getRange('b7').getValue(),
    sheetCeny.getRange('b8').getValue(),
    sheetCeny.getRange('b9').getValue(),
    sheetCeny.getRange('b10').getValue()
  ] );

  // Logger.log('Val: ' + sheetCeny.getRange('b2').getValue());
}
// =============================================================================
// Zkontroluje ceny a udela zaznam do sheetu Chk, kdyz je zmena posle mail
function t_Chk() {
  // Nastaveni data
  TimeNow();
  // Listy
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  var sheetLogs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Chks');
  var sTxt = '';
  var sLog = '';
  // Kontrola zmen tj. nenulova hodnota, sloupec D radky 2 az 9
  for(var i = 2; i <= 10; i++){
    // Oprava "#ERROR!" ve sloupce Døíve
    var CenaB = sheetCeny.getRange('b'+i).getValue()
    var Drive = sheetCeny.getRange('c'+i).getValue()
    Logger.log('i: ' + i +' CenaB: ' +  CenaB+' Drive: ' +  Drive);
    // Oprava "#ERROR!" ve sloupce Inet
    if (CenaB == '#ERROR!') { Logger.log('CenaB == #ERROR! - continue' ); continue; }
    // Opravim cenu Drive - slupec C
    if ( (Drive == '#ERROR!') && (!isNaN(CenaB))  ) {
      sheetCeny.getRange('c'+i).setValue( CenaB )
    }
    // Kontrola zmeny - slupec D <> 0
    var Zmena = sheetCeny.getRange('d'+i).getValue()
    Logger.log('Zmena: ' +  Zmena);
    // <>0 - poslat mail a zapsat
    if ( (Zmena != 0) && (!isNaN(Zmena))  ) {
      Logger.log('Zmena<>0: ' +  Zmena);
      sTxt += sheetCeny.getRange('a'+i).getValue()
      if (Zmena > 0) {
        sTxt += '+ ';
      }else{
        sTxt += '- ';
      }
      sLog += CrLf + sheetCeny.getRange('a'+i).getValue() +': '+F2dst2(Zmena)+
        ' z: ' + F2dst2(sheetCeny.getRange('c'+i).getValue()) +
        ' na: ' + F2dst2(sheetCeny.getRange('b'+i).getValue());
      // Zaznamenani casu zmeny pro benzinku
      sheetCeny.getRange('g'+i).setValue( sheetCeny.getRange('f'+i).getValue() )
      sheetCeny.getRange('f'+i).setValue( sheetCeny.getRange('k1' ).getValue() )
    }else{
        Logger.log('Zmena=0: ' +  Zmena);
    }
  }
  // Posilani mailu, kdyz je zmena
  if (!(sTxt == '')) {
    var now = new Date();
    // Definice emailu
    var EmailAdr = 'pegerle+pegBatTool@gmail.com';
    var sSubject = cAppName+':'+cAppVerz+' - zmìna ceny';
    var BodyText = sLog;
    BodyText += CrLf + sSubject;
    BodyText += CrLf + 'The time is: ' + now.toString();

    // Append a new string to the "url" variable to use as an email body.
    var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    BodyText += CrLf+CrLf + 'Link to table: ' + url;

    //  GmailApp.sendEmail('p+pegBatTool@egerle.cz', 'v2 - current time - pegBatTool', 'The time is: ' + now.toString());
    //  GmailApp.sendEmail('pegerle+pegBatTool@gmail.com', 'v5 - current time - pegBatTool', 'The time is: ' + now.toString());
    GmailApp.sendEmail(EmailAdr, sSubject, BodyText);

    // Zapsani data posledni zmeny
    sheetCeny.getRange('l3').setValue(new Date().toLocaleDateString() );
    sheetCeny.getRange('k3').setValue(new Date().toLocaleTimeString() );
    SpreadsheetApp.flush();

    // Ulozeni novych hodnot kopie sloupce B do C, a predtim z C do E
    for(var i = 2; i <= 10; i++){
      // Oprava "#ERROR!" ve sloupce Inet
      var CenaB = sheetCeny.getRange('b'+i).getValue()
      if (CenaB == '#ERROR!') {  continue; }
      sheetCeny.getRange('e'+i).setValue(sheetCeny.getRange('c'+i).getValue())
      sheetCeny.getRange('c'+i).setValue(sheetCeny.getRange('b'+i).getValue())
    }
    SpreadsheetApp.flush();
  }

  sTxt += ' OK.';
  sheetLogs.appendRow([
    sheetCeny.getRange('k1').getValue(),
    F2dst2(sheetCeny.getRange('b2').getValue()),
    F2dst2(sheetCeny.getRange('b3').getValue()),
    F2dst2(sheetCeny.getRange('b4').getValue()),
    F2dst2(sheetCeny.getRange('b5').getValue()),
    F2dst2(sheetCeny.getRange('b6').getValue()),
    F2dst2(sheetCeny.getRange('b7').getValue()),
    F2dst2(sheetCeny.getRange('b8').getValue()),
    F2dst2(sheetCeny.getRange('b9').getValue()),
    F2dst2(sheetCeny.getRange('b10').getValue()),
    sTxt
  ]);

  // Logger.log('Val: ' + sheetCeny.getRange('b2').getValue());

  // Aktualizace nazvu grafu
  t_GrafNazev1();
  t_GrafNazev2();
  SpreadsheetApp.flush();
}
// =============================================================================
// Posle hlaseni o cenach
/* Adresy
p+pegBatTool@egerle.com  p+pegBatTool@egerle.cz  peg4cbi+pegBatTool@gmail.com  egix@centrum.cz
pegerle+pegBatTool@gmail.com
*/
function t_RptMail() {
  // The code below will send an email with the current date and time.
  var now = new Date();
  // Definice emailu
  var EmailAdr = 'peg4cbi+pegBatTool@gmail.com, pegerle@unis.cz';
  var sSubject = cAppName+':'+cAppVerz+' - report';
  var BodyText = sSubject;
  BodyText += CrLf + 'The time is: ' + now.toString();

  // Vyplnìní hodnot - kolonky A1-B9
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  BodyText += CrLf+CrLf + 'Kdo \t\t Cena';
  for(var i = 2; i <= 10; i++){
    BodyText += CrLf +
      sheetCeny.getRange('a'+i).getValue() +
      ' \t\t ' +
      F2dst2( sheetCeny.getRange('c'+i).getValue()+0 );
  }

  // Append a new string to the "url" variable to use as an email body.
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  BodyText += CrLf+CrLf + 'Link to table: ' + url;

  //  GmailApp.sendEmail('p+pegBatTool@egerle.cz', 'v2 - current time - pegBatTool', 'The time is: ' + now.toString());
  //  GmailApp.sendEmail('pegerle+pegBatTool@gmail.com', 'v5 - current time - pegBatTool', 'The time is: ' + now.toString());
  GmailApp.sendEmail(EmailAdr, sSubject, BodyText);
}
// =============================================================================
// Aktualizuje titulek grafu - Titles in Google Sheets Charts - https://is.gd/3s8a16
function t_GrafNazev1() {
  const updatedTitle = "Ceny Benzínu v Brnì: ";
  // Datum beru z bunky k1
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  datum = sheetCeny.getRange('k1').getValue(),
  titulek = updatedTitle + datum
  Logger.log('titulek: ' + titulek);

const ss = SpreadsheetApp.getActiveSpreadsheet()
const ssId = ss.getId();
const chart = Sheets.Spreadsheets.get(ssId).sheets[0].charts[0];
delete chart.position;
chart.spec.title = titulek;
Sheets.Spreadsheets.batchUpdate({requests: [{updateChartSpec: chart}]}, ssId);
}
// =============================================================================
// Aktualizuje titulek grafu - Titles in Google Sheets Charts - https://is.gd/3s8a16
function t_GrafNazev2() {
  const updatedTitle = "Vývoj cen Benzínu v Brnì: ";
  // Datum beru z bunky k1
  var sheetCeny = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ceny');
  datum = sheetCeny.getRange('k1').getValue(),
  titulek = updatedTitle + datum
  Logger.log('titulek: ' + titulek);

const ss = SpreadsheetApp.getActiveSpreadsheet()
const ssId = ss.getId();
const chart = Sheets.Spreadsheets.get(ssId).sheets[1].charts[0];
delete chart.position;
chart.spec.title = titulek;
Sheets.Spreadsheets.batchUpdate({requests: [{updateChartSpec: chart}]}, ssId);
}
// =============================================================================
// End.
// =============================================================================
// =============================================================================
