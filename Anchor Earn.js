
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//---------------Set up Your Terra Address----------------------------
let terra_address = 'YOUR TERRA ADDRESS';
//--------------------------------------------------------------------
const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 2;

const widget = new ListWidget();
if (isDarkTheme) {
 widget.backgroundColor = new Color('#1C1C1E');; 
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://app.anchorprotocol.com/earn';


const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 20, 0);
headerStack.layoutHorizontally();

const headerImgStack = headerStack.addStack();
headerImgStack.setPadding(0,0,0,10);
const ANCImage = await loadImage('https://app.anchorprotocol.com/logo.png');
const headerImage = headerImgStack.addImage(ANCImage);
headerImage.imageSize = new Size(20, 20);
headerImage.centerAlignImage();

const headerTxtStack = headerStack.addStack();
headerTxtStack.setPadding(0,0,0,8);
const headerTxt = headerTxtStack.addText('Anchor Earn');
headerTxt.font = Font.boldSystemFont(18);

async function buildWidget(terra_address) {
    const ancINFO = await getAnchorInfo(terra_address);
  	var time = parseISOString(ancINFO.time);
    addInfo('UST', `$ ${ancINFO.price}`);
    addInfo('APY', `${ancINFO.apy}%`);
	const rowStack = widget.addStack();	
   	rowStack.setPadding(10, 7, 0, 0);
   	rowStack.layoutHorizontally();
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
  
   symbolStack.setPadding(0, 0, 0, 30);
    
   const symbolText = symbolStack.addText(symbol);
   symbolText.font = Font.mediumSystemFont(16);
  
   const priceText = priceStack.addText(price);
   priceText.font = Font.mediumSystemFont(16);
  
  if (isDarkTheme) {
    symbolText.textColor = new Color('#FFFFFF');
  }
  
}

async function getAnchorInfo(address) {
  const url = `https://ancinfo.herokuapp.com/anc_info/${address}`;
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { price: apiResult.Current_Balance, apy: apiResult.APY, time: apiResult.Timestamp};
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
await buildWidget(terra_address);

Script.setWidget(widget);
widget.presentSmall();
widget.refreshAfterDate = new Date(Date.now() + 1000 * 120) // Refresh every 120 Second
Script.complete();

