import itemsData from "./items.mjs"

export default function generateDoc(order) {
    const date = new Date(order.createdAt);
    let doc = `注文ID: ${order.submitId}|`;
    if(order.isEatIn){doc += `^^^テーブル ${order.tableNum}`;}else{doc += `^^^"持ち帰り ${order.tableNum}"`;}
    doc += `\n 時間 : ${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n
    {width:2,*,4; border:line}
--------------------------------------
|     |   ^^品名    | ^^数量 |
-
`
    order.orderItems.forEach(orderItem => {
        const item = itemsData.find(item => item.id === orderItem.itemId);
        // console.log(item);
        doc += `| [] | ${item.name} | ^^${orderItem.quantity} |\n`
    });
    return doc;
}
