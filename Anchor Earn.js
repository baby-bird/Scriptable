// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: dollar-sign;

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//---------------Set up Your Terra Address----------------------------
let terra_address = 'YOUR TERRA ADDRESS';
//--------------------------------------------------------------------
const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 0;

const widget = new ListWidget();
widget.backgroundColor = new Color("#1A1A1A"); 
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://app.anchorprotocol.com/earn';

let ANCImage = await loadImage('https://app.anchorprotocol.com/logo.png');
let headerImage = widget.addImage(ANCImage);
headerImage.imageSize = new Size(30, 30);
headerImage.centerAlignImage();

widget.addSpacer(6)


async function buildWidget(terra_address) {
    const ancINFO = await getAnchorInfo(terra_address);  
    addInfo('Total Deposit', `${Number(ancINFO.price).toFixed(1)} UST`);
    addInfo('APY', `${ancINFO.apy.toFixed(2)} %`); 	const rowStack = widget.addStack();
    
    const USTprice = await getUSTPrice();
    const USTText = widget.addText(`UST : $ ${Number(USTprice.inUSDT).toFixed(4)}`);
   	USTText.font = Font.systemFont(10);
  	USTText.centerAlignText();
  	USTText.textColor = Color.gray();	

	
	widget.addSpacer(2);
	const timeText = widget.addText('Last Update : '+ ancINFO.time);
   	timeText.font = Font.systemFont(10);
  	timeText.centerAlignText();
  	timeText.textColor = Color.gray();
}

function addInfo(symbol, price) {
    
   	const symbolText = widget.addText(symbol);
   	symbolText.font = Font.boldSystemFont(10);
  	symbolText.centerAlignText()
  	symbolText.textColor = Color.white()
  
//   	widget.addSpacer(3)
  
   	const priceText = widget.addText(price);
   	priceText.font = Font.systemFont(16);
	priceText.centerAlignText()
	priceText.textColor = Color.orange()
	widget.addSpacer(3)
	
  
}

async function getAnchorInfo(address) {  
  let req = new Request("https://mantle.terra.dev/?cw20--balance=terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu");
  req.method = "post";
  req.headers = {
  	"Content-Type": "application/json"
  };
  req.body = JSON.stringify({"query":"{\n  tokenBalance: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\""+ address + "\\\"}}\"\n  ) {\n    Result\n    Height\n  }\n}\n","variables":{}
  });
  let res = await req.loadJSON();
  let result = res.data;
  var aUST_bal_JSON = JSON.parse(result.tokenBalance.Result);
  let aUST_bal = aUST_bal_JSON.balance/Math.pow(10,6)
  
  let req2 = new Request("https://api.anchorprotocol.com/api/v1/market/ust");
  let res2 = await req2.loadJSON();
  //let result = JSON.parse(res);
  var conv_rate = res2.exchange_rate
  var apy = res2.deposit_apy*100
  const time = new Date();
  let uptimeTxt = time.toLocaleTimeString('ko-KR');
  return { price: aUST_bal*conv_rate, apy: apy, time: uptimeTxt};
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

async function getUSTPrice() {
  const url = 'https://api.binance.com/api/v3/ticker/price?symbol=USTUSDT';
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { inUSDT : apiResult.price};
}


await buildWidget(terra_address);

Script.setWidget(widget);
widget.presentSmall();
widget.refreshAfterDate = new Date(Date.now() + 1000 * 120) // Refresh every 120 Second
Script.complete();

