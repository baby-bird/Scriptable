
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//-------------- Set up your ETH Address ------------------------
let eth_address = 'YOUR ETH Address';
//---------------------------------------------------------------
let CryptoPair = 'KRW-ETH';

const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 2;

const widget = new ListWidget();
if (isDarkTheme) {
 widget.backgroundColor = new Color('#1C1C1E');; 
}
widget.setPadding(padding, padding, padding, padding);

widget.url = `https://ethermine.org/miners/${eth_address}/dashboard`;

const headerStack = widget.addStack();
headerStack.setPadding(0, 7, 10, 0);
headerStack.layoutHorizontally();

const headerImgStack = headerStack.addStack();
headerImgStack.setPadding(0,0,0,10);
const ethereumImage = await loadImage('https://rubic.exchange/assets/images/widget/ethereum.png');
const headerImage = headerImgStack.addImage(ethereumImage);
headerImage.imageSize = new Size(20, 20);
headerImage.centerAlignImage();

const headerTxtStack = headerStack.addStack();
headerTxtStack.setPadding(0,0,0,8);
const headerTxt = headerTxtStack.addText('Miner Stat');
headerTxt.font = Font.boldSystemFont(18);

async function buildWidget(eth_adress, CryptoPair) {
    const mineINFO = await getMinerInfo(eth_adress,CryptoPair);
  	const Earning = mineINFO.Current_Earning
    addInfo('Earned', `₩ ${Earning.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
    addInfo('c Hash', `${mineINFO.current_Hash}MH/s`);
    addInfo('r Hash', `${mineINFO.reported_Hash}MH/s`);
	const rowStack = widget.addStack();	
   	rowStack.setPadding(10, 7, 0, 0);
   	rowStack.layoutHorizontally();
  	const time = new Date();
	const timeStack = rowStack.addStack(); 
	const timeText = timeStack.addText('마지막 업데이트 : '+time.toLocaleTimeString('ko-KR'));
   	timeText.font = Font.mediumSystemFont(9);
}

function addInfo(symbol, price) {
   const rowStack = widget.addStack();
   rowStack.setPadding(0, 7, 10, 0);
   rowStack.layoutHorizontally();
  
   const symbolStack = rowStack.addStack(); 
   const priceStack = rowStack.addStack(); 
  
   symbolStack.setPadding(0, 0, 0, 10);
    
   const symbolText = symbolStack.addText(symbol);
   symbolText.font = Font.mediumSystemFont(16);
  
   const priceText = priceStack.addText(price);
   priceText.font = Font.mediumSystemFont(14);
  
  if (isDarkTheme) {
    symbolText.textColor = new Color('#FFFFFF');
  }
  
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


async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

await buildWidget(eth_address, CryptoPair);

Script.setWidget(widget);
widget.presentSmall();
widget.refreshAfterDate = new Date(Date.now() + 1000 * 120) // Refresh every 120 Second
Script.complete();

