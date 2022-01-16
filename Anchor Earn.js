// Design of this Widget is inspired by following url
// https://www.reddit.com/r/ethermine/comments/o034m7/scriptable_ios_widget_to_keep_tracking_your_pool/
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

widget.addSpacer(8)


async function buildWidget(terra_address) {
    const ancINFO = await getAnchorInfo(terra_address);
  	var time = parseISOString(ancINFO.time);
    addInfo('Total Deposit', `$ ${Number(ancINFO.price).toFixed(1)}`);
    addInfo('APY', `${ancINFO.apy} %`); 	const rowStack = widget.addStack();	
	widget.addSpacer(2);
	const timeText = widget.addText('마지막 업데이트 : '+time.toLocaleTimeString('ko-KR'));
   	timeText.font = Font.systemFont(10);
  	timeText.centerAlignText();
  	timeText.textColor = Color.gray();
}

function addInfo(symbol, price) {
    
   	const symbolText = widget.addText(symbol);
   	symbolText.font = Font.boldSystemFont(10);
  	symbolText.centerAlignText()
  	symbolText.textColor = Color.white()
  
  	widget.addSpacer(3)
  
   	const priceText = widget.addText(price);
   	priceText.font = Font.systemFont(16);
	priceText.centerAlignText()
	priceText.textColor = Color.orange()
	widget.addSpacer(3)
	
  
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

