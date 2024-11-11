import recieptline from "receiptline";
import convertSVG from 'convert-svg-to-png';
// import {Printer , Image} from "@node-escpos/core";
// import USB from "@node-escpos/usb-adapter";

import escpos from 'escpos';
import escposUSB from 'escpos-usb';
escpos.USB = escposUSB;

export default function printDoc(doc) {
    const display = {
        cpl: 32,
        encoding: "shiftjis",
    }
    const svg = recieptline.transform(doc, display);

    convertSVG.convert(svg).then(png => {
        try {
            const usbDevice = new escpos.USB(0x0416, 0x5011);
        const options = { encoding: "shiftjis" };
        const printer = new escpos.Printer(usbDevice, options);
        const dataURI = "data:image/png;base64," + png.toString("base64");
        escpos.Image.load(dataURI, function (image) {
            usbDevice.open(function () {
                printer.image(image,"D24");
                printer.text("\nend");
                printer.close();
            });
        });
        } catch (error) {
            console.error("Print failed");
            console.log(error);
        }
        
    });
}