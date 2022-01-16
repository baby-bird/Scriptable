// Design and structure of this code is inspired by following url
// https://www.reddit.com/r/ethermine/comments/o034m7/scriptable_ios_widget_to_keep_tracking_your_pool/
//--------------- YOUR ETH ADDRESS ---------------
const address = 'YOUR ADDRESS'
//---------------------------------------------

/// CONFIG
const mineINFO = await getMinerInfo(address,'KRW-ETH');
const unpaid = mineINFO.Current_Earning
const activeWorkers = mineINFO.Active_Worker;
const Monthly_Earning = mineINFO.Monthly_Earning;
const reportHash = mineINFO.reported_Hash;
const i = new Request('https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png')
const img = await i.loadImage()

// SCRIPT
let widget = createWidget(unpaid, activeWorkers, img, Monthly_Earning, reportHash)

if (config.runsInWidget) {
  widget.url = `https://ethermine.org/miners/${address}/dashboard`;
  Script.setWidget(widget)
  Script.complete()
  
}
else {
  widget.presentSmall()
}


// Widget layout 
function createWidget(unpaid, activeWorkers, img, Monthly_Earning, reportHash) {
  let w = new ListWidget()
  w.backgroundColor = new Color("#1A1A1A")

  let image = w.addImage(img)
  image.imageSize = new Size(30, 30)
  image.centerAlignImage()

  w.addSpacer(8)

  let staticText = w.addText("Unpaid Balance")
  staticText.textColor = Color.white()
  staticText.font = Font.boldSystemFont(10)
  staticText.centerAlignText()

  w.addSpacer(3)

  let unpaidTxt = w.addText(`₩ ${unpaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
  unpaidTxt.textColor = Color.orange()
  unpaidTxt.font = Font.systemFont(16)
  unpaidTxt.centerAlignText()
  
  w.addSpacer(3)

  let monthlyStaticTxt = w.addText("Monthly Earning")
  monthlyStaticTxt.textColor = Color.white()
  monthlyStaticTxt.font = Font.boldSystemFont(10)
  monthlyStaticTxt.centerAlignText()

  w.addSpacer(3)

  let monthlyTxt = w.addText(`₩ ${Monthly_Earning.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
  monthlyTxt.textColor = Color.orange()
  monthlyTxt.font = Font.systemFont(16)
  monthlyTxt.centerAlignText()

  let coinsPerMinTxt = w.addText((activeWorkers || 0) + " active / " + reportHash + " MH/s")
  coinsPerMinTxt.textColor = Color.gray()
  coinsPerMinTxt.font = Font.systemFont(10)
  coinsPerMinTxt.centerAlignText()
	
  w.addSpacer(3)  
  const time = new Date();
  let uptimeTxt = w.addText('마지막 업데이트 : '+time.toLocaleTimeString('ko-KR'));
  uptimeTxt.textColor = Color.gray()
  uptimeTxt.font = Font.systemFont(10)
  uptimeTxt.centerAlignText()

  w.addSpacer(8)
  w.setPadding(0, 0, 0, 0)
  return w
}

async function getMinerInfo(address, CryptoPair) {
  const url = `https://api.ethermine.org/miner/:${address}/currentStats`;
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  const CryptoInfo = await getCryptoPrice(CryptoPair);
  const eth_price = CryptoInfo.price;
  const apiJson = apiResult.data;
  apiJson.Current_Earning = apiJson.unpaid*Math.pow(10,-18)*eth_price;
  apiJson.Monthly_Earning = apiJson.coinsPerMin*60*24*30*eth_price;
  apiJson.reportedHashrate = apiJson.reportedHashrate*Math.pow(10,-6);
  apiJson.currentHashrate = apiJson.currentHashrate*Math.pow(10,-6);
  return { Current_Earning: apiJson.Current_Earning.toFixed(0), Monthly_Earning: apiJson.Monthly_Earning.toFixed(0), 
  			Active_Worker: apiJson.activeWorkers, reported_Hash : apiJson.reportedHashrate.toFixed(1), current_Hash : apiJson.currentHashrate.toFixed(1)};
}

async function getCryptoPrice(CryptoPair) {
  const url = `https://api.upbit.com/v1/ticker?markets=${CryptoPair}`;
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { price: apiResult[0].trade_price};
}