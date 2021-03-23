// Benzín.gs
//
"use strict"
//
function prevedEuroNaKoruny(euro){
  if(typeof euro != "number") throw "Vstupní hodnota musí být èíslo";
  return euro*ziskejKurz_();
}
function ziskejKurz_(){
  var data = UrlFetchApp.fetch("http://www.cnb.cz/cs/financni_trhy/" +
  "devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt");
  var kurz = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  return parseFloat(kurz);
}
function g_Ono1(){
  var html = UrlFetchApp.fetch('http://www.tank-ono.cz/cz/index.php?page=cenik').getContentText();
  return html
}
function g_Ono2(){
  var contestURL = 'http://www.tank-ono.cz/cz/index.php?page=cenik';
  var page = UrlFetchApp.fetch(contestURL).getContentText();
  return page
}
// =============================================================================
// TankONO - http://www.tank-ono.cz/cz/index.php?page=cenik
function g_Ono(){
  var contestURL = 'http://www.tank-ono.cz/cz/index.php?page=cenik';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // brno[^]*\<\/tr\>    I
  var regExp = new RegExp('brno[^]*?\<\/tr\>', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Ono' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Tesco - http://itesco.cz/sluzby-a-znacky/tesco-sluzby/cerpaci-stanice/cerpaci-stanice
function g_Tesco(){
  var contestURL = 'http://itesco.cz/sluzby-a-znacky/tesco-sluzby/cerpaci-stanice/cerpaci-stanice/';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // Brno\<\/strong\>[^]*?\<\/tr\>
  var regExp = new RegExp('Brno\<\/strong\>[^]*?\<\/tr\>', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Tesco' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Globus - https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html
// https://www.globus.cz/brno.html
function g_Globus1(){
  var contestURL = 'https://www.globus.cz/brno.html';
  // var page = UrlFetchApp.fetch(contestURL);
  // var page = UrlFetchApp.fetch(contestURL,{muteHttpExceptions:true});
  var options = {
    "followRedirects" : true,
    "muteHttpExceptions" :true
  };
var page = UrlFetchApp.fetch(contestURL,options);
//var followedPost = UrlFetchApp.fetch(properUrl, {'followRedirects': false, 'muteHttpExceptions': false});
//Logger.log(followedPost.getHeaders()['Location']);
  var tst = page.getContentText()
   return tst
  //{
  //  muteHttpExceptions: true });
  //Logger.log("code: " + result.getResponseCode());
  //Logger.log("text: " + result.getContentText());
  //};
  // Natural 95[^]*?\/sup
  var regExp = new RegExp('Natural 95[^]*?\/sup', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();
  // vyhodit: <sup>
  var value1 = value1.replace('<sup>','');
  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);
  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);
  return value2
}
// =============================================================================
// Globus - https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html
/*
// https://www.npmjs.com/package/phantomjscloud
  https://phantomjscloud.com
  Email: peg4cbi+phantomjscloud@gmail.com
  ApiKey: muj-api-klic
  Url (uriComponent encoded requests)
  http(s)://PhantomJsCloud.com/api/browser/v2/[YOUR-KEY]/?request=[REQUEST-JSON]
*/
function g_Globus3(){
  // var pageRequest = { url: "https://amazon.com", renderType: "plainText" };
  var pageRequest = {url:"https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html",renderType:"html"};
  Logger.log("about to request page from PhantomJs Cloud.  request =" + JSON.stringify(pageRequest) );
  // http(s)://PhantomJsCloud.com/api/browser/v2/[YOUR-KEY]/?request=[REQUEST-JSON]
  var contestURL = 'https://PhantomJsCloud.com/api/browser/v2/muj-api-klic/?request=' + encodeURIComponent(JSON.stringify(pageRequest));
  Logger.log('contestURL: ' +  contestURL);
  var page = UrlFetchApp.fetch(contestURL);
  // return page.getContentText().toString()

  // <td class="prices__cell prices__cell--price">29,<sup>90</sup></td>
  var regExp = new RegExp('prices__cell--price[^]*?\/sup\>', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // vyhodit: <sup>
  var value1 = value1.replace('<sup>','');

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Globus' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Globus - https://goo.gl/KGt9oE
function g_Globus(){
  var contestURL = 'https://goo.gl/KGt9oE';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // peRequired[^]*?\<\/td\>
  // price[^]*?\CZK
  var regExp = new RegExp('price[^]*?\CZK', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Globus' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Makro - https://www.makro.cz/prodejny/brno
function g_Makro(){
  var contestURL = 'https://www.makro.cz/prodejny/brno';
  var page = UrlFetchApp.fetch(contestURL);
  // var test = page.getContentText().toString();

  // peRequired[^]*?\<\/td\>
  // var regExp = new RegExp('peRequired[^]*?\<\/td\>', 'i');
  var regExp1 = new RegExp('peRequired[^]*?\<\/tr\>', 'i');
  var value1 = regExp1.exec(page.getContentText()).toString();
  // "peRequired[^]*?\<\/td\>
  var regExp2 = new RegExp('\"peRequired[^]*?\<\/td\>', 'i');
  var value2 = regExp2.exec(value1).toString();
  // \d\d\,\d\d
  // var regExp3 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  // var regExp3 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  // \s\d\d.*?\s
  var regExp3 = new RegExp('\\s\\d\\d.*?\\s', 'i');
  var value3 = regExp3.exec(value2).toString().trim();

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Makro' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// g_Mapy - nacte cenu pro sLink z mapy.cz pomoci https://www.npmjs.com/package/phantomjscloud
/*
*/
function g_MapyT(sLink){
//var pageRequest = {url:"https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html",renderType:"html"};
  var pageRequest = {url:sLink,renderType:"plainText"};
  Logger.log("about to request page from PhantomJs Cloud.  request =" + JSON.stringify(pageRequest) );
                 // https://PhantomJsCloud.com/api/browser/v2/[YOUR-KEY]/?request=[REQUEST-JSON]
  var contestURL = 'https://PhantomJsCloud.com/api/browser/v2/muj-api-klic/?request=' + encodeURIComponent(JSON.stringify(pageRequest));
  Logger.log('contestURL: ' +  contestURL);
  var page = UrlFetchApp.fetch(contestURL);
  var test = page.getContentText();

  // Benzín	33,90 Kè
  var regExp = new RegExp('\\d\\d\\,\\d\\d', 'im');
  var value1 = regExp.exec(page.getContentText()).toString();

  RtnVal = value1;
  Logger.log('Fce: ' + 'g_Mapy' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// g_Mapy - nacte cenu pro sLink z mapy.cz pomoci https://www.npmjs.com/package/phantomjscloud
/*
*/
function g_MapyL(sLink){
//var pageRequest = {url:"https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html",renderType:"html"};
  var pageRequest = {url:sLink,renderType:"html"};
  Logger.log("about to request page from PhantomJs Cloud.  request =" + JSON.stringify(pageRequest) );
                 // https://PhantomJsCloud.com/api/browser/v2/[YOUR-KEY]/?request=[REQUEST-JSON]
  var contestURL = 'https://PhantomJsCloud.com/api/browser/v2/muj-api-klic/?request=' + encodeURIComponent(JSON.stringify(pageRequest));
  Logger.log('contestURL: ' +  contestURL);
  var page = UrlFetchApp.fetch(contestURL);
  var test = page.getContentText();

  // price[^]*?\CZK
  // price.*?CZK
  // --
  //  var regExp = new RegExp('price.*?CZK', 'im');
  //  var value1 = regExp.exec(page.getContentText()).toString();

//><span itemprop="price" content="33.90">33,90 Kè</span><meta content="CZK"
  var regExp = new RegExp('price', 'im');
  var value1 = regExp.exec(page.getContentText());

  // vyhodit: <sup>
  var value1 = value1.replace('<sup>','');

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();
  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Mapy' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// g_Mapy - https://goo.gl/kzvuBY - g_Mapy
function g_Mapy(contestURL){
  // for testing: var contestURL = 'https://goo.gl/kzvuBY';
  RtnVal = g_MapyT(contestURL)
  return RtnVal
}
// =============================================================================
// g_Mapy - https://goo.gl/kzvuBY - g_Mapy
function g_Mapy_Test(contestURL){
  var contestURL = 'https://goo.gl/kzvuBY';
  RtnVal = g_MapyT(contestURL)
  return RtnVal
}
// =============================================================================
// Shell - https://goo.gl/kzvuBY
function g_Shell(){
  var contestURL = 'https://goo.gl/kzvuBY';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // peRequired[^]*?\<\/td\>
  // price[^]*?\CZK
  var regExp = new RegExp('price[^]*?\CZK', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Shell' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// MOL - https://goo.gl/nwqppc
function g_MOL(){
  // nefungue
  var contestURL = 'https://goo.gl/nwqppc';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // peRequired[^]*?\<\/td\>
  // price[^]*?\CZK
  var regExp = new RegExp('price[^]*?\CZK', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_MOL' + ' cena: ' + RtnVal);
  return RtnVal
}

// =============================================================================
// Albert - https://goo.gl/FqSFYm
function g_Albert1(){
  // nefungue
  var contestURL = 'https://goo.gl/FqSFYm';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // price[^]*?\CZK
  var regExp = new RegExp('price[^]*?\CZK', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Albert1' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Albert - https://goo.gl/CY79en
function g_Albert(){
  // nefungue

  var contestURL = 'https://goo.gl/CY79en';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // "costLarge">30.30</span>
  // price[^]*?\CZK
  var regExp = new RegExp('costLarge[^]*?\span', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\.\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();

  // . -> ,
  var value3 =   value2.replace(".", ",");

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Albert' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// OMV - https://goo.gl/4QfGSy
function g_OMV(){
  // nefungue
  var contestURL = 'https://goo.gl/4QfGSy';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // peRequired[^]*?\<\/td\>
  // price[^]*?\CZK
  var regExp = new RegExp('price[^]*?\CZK', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\,\\d\\d', 'i');
  var value2 = regExp2.exec(value1);

  RtnVal = value2;
  Logger.log('Fce: ' + 'g_Albert' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// Rothbury - https://rothbury.cz/cerpaci-stanice/verejna-cerpaci-stanice-olomoucka-brno
// https://www.facebook.com/tankovacimat
function g_Rothbury(){
  var contestURL = 'https://rothbury.cz/cerpaci-stanice/verejna-cerpaci-stanice-olomoucka-brno';
  var page = UrlFetchApp.fetch(contestURL);
  // Logger.log('contestURL: ' + contestURL );
  // Logger.log('page: ' + page );

  // 95\:[^]*?tr
  var regExp = new RegExp('natural.95.*\/li', 'i');
  Logger.log('regExp: ' + regExp );
  var value1 = regExp.exec(page.getContentText()).toString();
  Logger.log('value1: ' + value1 );

  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\.\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();
  Logger.log('value2: ' + value2 );

  // . -> ,
  var value3 =   value2.replace(".", ",");
  Logger.log('value3: ' + value3 );

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Rothbury' + ' cena: ' + RtnVal);
  return RtnVal
}

// =============================================================================
// Rothbury - https://rothbury.cz/cerpaci-stanice/verejna-cerpaci-stanice-olomoucka-brno
// https://www.facebook.com/tankovacimat   - Natural 28,79 Kè/L
function g_Rothbury2(){
  var contestURL = 'https://www.facebook.com/tankovacimat';
  var page = UrlFetchApp.fetch(contestURL);
  Logger.log('contestURL: ' + contestURL );
  // Logger.log('page: ' + page );

  // 95\:[^]*?tr
  var regExp = new RegExp('natural.*Kè', 'i');
  var regExp = new RegExp('NATURAL.95.+DIESEL', 'i');
  Logger.log('regExp: ' + regExp );
  var value1 = regExp.exec(page.getContentText()).toString();
  Logger.log('value1: ' + value1 );

  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\.\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();
  Logger.log('value2: ' + value2 );

  // . -> ,
  var value3 =   value2.replace(".", ",");
  Logger.log('value3: ' + value3 );

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Rothbury' + ' cena: ' + RtnVal);
  return RtnVal
}


// =============================================================================
// Rothbury3 - https://www.mbenzin.cz/Ceny-benzinu-a-nafty/Brno/Rothbury-Olomoucka-174/18648
function g_Rothbury3(){
  var contestURL = 'https://is.gd/pJbbOS';
  var page = UrlFetchApp.fetch(contestURL);
  // var r3 = new RegExp('<div style="font-size:0.9em">', 'gis');

  // ContentPlaceHolder1_mPriceN95.*?\>
  var regExp = new RegExp('ContentPlaceHolder1_mPriceN95.*?\>', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\.\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();

  // . -> ,
  var value3 =   value2.replace(".", ",");

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Rothbury3' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// g_mBenzinT - https://www.mbenzin.cz/Ceny-benzinu-a-nafty/Brno/Rothbury-Olomoucka-174/18648
function g_mBenzinT(sLink){
//var pageRequest = {url:"https://www.globus.cz/brno/cerpaci-stanice-a-myci-linka.html",renderType:"html"};
  var pageRequest = {url:sLink,renderType:"plainText"};
  Logger.log("about to request page from PhantomJs Cloud.  request =" + JSON.stringify(pageRequest) );
                 // https://PhantomJsCloud.com/api/browser/v2/[YOUR-KEY]/?request=[REQUEST-JSON]
  var contestURL = 'https://PhantomJsCloud.com/api/browser/v2/muj-api-klic/?request=' + encodeURIComponent(JSON.stringify(pageRequest));
  Logger.log('contestURL: ' +  contestURL);
  var page = UrlFetchApp.fetch(contestURL);
  var test = page.getContentText();

  // ContentPlaceHolder1_mPriceN95.*?\>
  var regExp = new RegExp('ContentPlaceHolder1_mPriceN95.*?\>', 'i');
  var value1 = regExp.exec(page.getContentText()).toString();

  //var cena = data.getContentText().split("\n")[7].split("|")[4].replace(",",".");
  //return parseFloat(cena);

  // \d\d\,\d\d
  var regExp2 = new RegExp('\\d\\d\\.\\d\\d', 'i');
  var value2 = regExp2.exec(value1).toString();

  // . -> ,
  var value3 =   value2.replace(".", ",");

  RtnVal = value3;
  Logger.log('Fce: ' + 'g_Rothbury2' + ' cena: ' + RtnVal);
  return RtnVal
}
// =============================================================================
// g_mBenzin - https://is.gd/QVNkoC - g_mBenzin
function g_mBenzin(contestURL){
  // for testing: var contestURL = 'https://is.gd/pJbbOS';
  RtnVal = g_MapyT(contestURL)
  return RtnVal
}
// =============================================================================
