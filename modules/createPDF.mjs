import {PDFDocument , StandardFonts} from 'pdf-lib';
import fs from 'fs';
import fontkit from '@pdf-lib/fontkit';
import {itemsData} from "../assets/items.mjs";


export default async function createReceipt(order) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync('./assets/GenShinGothic-Regular.ttf');
    const genshinGothic = await pdfDoc.embedFont(fontBytes,{ subset: true });
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const length = order.orderItems.length;
    const page = pdfDoc.addPage([204.1,171+29*length]);
    var { width, height } = page.getSize();
    height = height - 10;
    const pngImageBytes = fs.readFileSync('./assets/reciept-header.png'); //本番環境用
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    page.drawImage(pngImage, {
        x: (204.1-164.41)/2 ,
        y: height - 57,
        width: 164.41,
        height: 57,
    });
    page.setFont(genshinGothic);
    page.setFontSize(8);
    function getTextWidth(font,text,size){
        return font.widthOfTextAtSize(text,size);
    }
    page.drawText("筑波大学附属駒場高等学校73期 高3喫茶班", { x: width/2 - getTextWidth(genshinGothic,"筑波大学附属駒場高等学校73期 高3喫茶班",8)/2, y: height - 65});
    page.drawText("ID : " + order.submitId, { x: width/2 - getTextWidth(helveticaFont,"ID : " + order.submitId,8)/2, y: height - 78 , font: helveticaFont});
    order.isEatIn ? page.drawText(`テーブル番号 : ${order.tableNum}`, { x: width/2 - getTextWidth(genshinGothic,`テーブル番号 : ${order.tableNum}`,8)/2, y: height - 88 , font: genshinGothic}) : page.drawText(`持ち帰り番号 : ${order.tableNum}`, { x: width/2 - getTextWidth(genshinGothic,`持ち帰り番号 : ${order.tableNum}`,8)/2, y: height - 88 , font: genshinGothic});
    const date = new Date();
    page.drawText(`2024年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`, { x: width/2 - getTextWidth(genshinGothic,`2024年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`,8)/2, y: height - 98 , font: genshinGothic});

    page.drawLine({start: {x: 10, y: height - 105}, end: {x: width-10, y: height - 105}});
    page.drawText("領収書" , { x: width/2 - getTextWidth(genshinGothic,"領収書",10)/2, y: height - 113 , font: genshinGothic});
    page.drawLine({start: {x: 10, y: height - 117}, end: {x: width-10, y: height - 117}});
    order.orderItems.forEach((v,i) => {
        const item = itemsData.find((item) => item.id === v.itemId);
        page.drawText(item.name, { x: 10, y: height - 117 - 29 * i - 17});
        page.drawText( v.quantity.toString(), { x: 80, y: height - 117 - 29 * i - 29, font: helveticaFont});
        page.drawText("点" , { x: 117 + helveticaFont.widthOfTextAtSize(v.quantity.toString(),8), y: height - 117 - 29 * i - 29});
        page.drawText("¥" + item.price, { x: 50, y: height - 117 - 29 * i - 29, font: helveticaFont});
        page.drawText("¥" + item.price * v.quantity, { x: width - getTextWidth(helveticaFont ,"¥" + item.price * v.quantity ,8) - 20, y: height - 117 - 29 * i - 29, font: helveticaFont});
    });
    page.drawLine({start: {x: 10, y: height - 117 -9 - 29 * order.orderItems.length}, end: {x: width-10, y: height - 117 - 9 - 29 * order.orderItems.length} , dashArray: [2, 2]});
    page.setFontSize(10);
    page.drawText("合計", { x: 10, y: height - 117 - 29 * order.orderItems.length - 29});
    page.drawText("¥" + order.total, { x: width - getTextWidth(helveticaFont ,"¥" + order.total ,10) - 20, y: height - 117 - 29 * order.orderItems.length - 29, font: helveticaFont});
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(`./tmp/${order.submitId}.pdf`, pdfBytes);
    return pdfBytes;
}

createReceipt({
    "_id": {
      "$oid": "66ddc14d46022c142780278c"
    },
    "persons": 1,
    "payment": "cash",
    "orderItems": [
      {
        "itemId": 1,
        "area": "Ginger",
        "quantity": 1,
        "orderId": "191d23ae7d625",
        "isCompleted": true,
        "_id": {
          "$oid": "66ddc14d46022c142780278d"
        }
      }
    ],
    "total": 200,
    "submitId": "191d23b14753a",
    "isServed": false,
    "tableNum": 56,
    "isEatIn": false,
    "createdAt": {
      "$date": "2024-09-08T15:22:53.216Z"
    },
    "updatedAt": {
      "$date": "2024-09-08T15:22:53.216Z"
    },
    "__v": 0
  });