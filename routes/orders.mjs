import express from 'express';
import { MongoClient, ServerApiVersion } from "mongodb"
// import { pdf2png } from '../modules/pdf2png.js';
// import createPDF from '../modules/createPDF.mjs';
// import print from "../modules/print.mjs"
// import { promises as fs } from 'fs';
import generateDoc from '../modules/generateDoc.mjs';
import printDoc from '../modules/recieptLine.mjs';
import request from 'request';
const router = express.Router();



const uri = "mongodb+srv://wavetakuto:password12345@kissa-pos.1r4kekm.mongodb.net?retryWrites=true&w=majority";

function postForReciept(order) {
    const date = new Date();
    order.printDate = date;
    request.post({
        url: "http://raspi.local:8000/api/reciepts",
        json: order,
    }, (err, res, body) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(body);
    });
}



router.get("/:submitId", (req, res) => {
    const client = new MongoClient(uri,
        {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    async function run() {
        try {
            const database = client.db("test");
            const orders = database.collection("orders");
            const order = await orders.findOne({ submitId: req.params.submitId });
            if (order === null) {
                res.status(404).send("Not Found");
                return;
            }
            printDoc(generateDoc(order))
            // postForReciept(order);
            return res.status(200).send("Printed");
        } finally {
            await client.close();

        }
    }
    run().catch(console.dir);

});

router.get("/reciept/:submitId", (req, res) => {
    const client = new MongoClient(uri,
        {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    async function run() {
        try {
            const database = client.db("test");
            const orders = database.collection("orders");
            const order = await orders.findOne({ submitId: req.params.submitId });
            if (order === null) {
                res.status(404).send("Not Found");
                return;
            }
            postForReciept(order);
            res.status(200).send("Printed");
        } finally {
            await client.close();

        }
    }
    run().catch(console.dir);
});

export default router;