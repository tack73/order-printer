import {Printer , Image} from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";

export default async function print(pdfByte){
    const device = new USB();
    device.open(async (err)=>{
        if(err) return;
        const options = {
            encoding : "GB18030"
        }
        let printer = new Printer(device,options);
        const image = await Image.load(pdfByte);
        printer = await printer.image(image,"d24");
        printer.close();
    });
}