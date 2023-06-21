import 'dotenv/config'
import express from 'express'
import GoogleSheetServiceConfig from "./googleSheetServiceConfig.js";

import {GoogleSpreadsheet} from 'google-spreadsheet';
import {generateDiscountCode, isPhoneNumberValid} from './utils.js';


let app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));
app.set("view engine", "ejs");
app.set('views', './server/views/');
let port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.render('index.ejs', {isError: false});
})

app.post('/submit', async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;

    if (!isPhoneNumberValid(phone)) {
        res.render('index.ejs', {isError: true});
        return;
    }

    const PRIVATE_KEY = GoogleSheetServiceConfig.private_key;
    const CLIENT_EMAIL = GoogleSheetServiceConfig.client_email;
    const SHEET_ID = process.env.SHEET_ID;

    try {
        // Initialize the sheet - doc ID is the long id in the sheets URL
        const doc = new GoogleSpreadsheet(SHEET_ID);

        // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        // Access a specific worksheet by its index or title
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

        // Get all rows in the worksheet
        const rows = await sheet.getRows();

        const isPhoneExist = rows.some(row => row['Số điện thoại'] === phone);

        if (isPhoneExist) {
            res.render('index.ejs', {isError: true});
            return;
        }
        const discountCode = generateDiscountCode(phone);
        res.render('coupon.ejs', {discountCode})
        await sheet.addRow({
            'STT': rows.length + 1,
            'Tên': name,
            'Số điện thoại': `'${phone}`,
            'Mã giảm giá': discountCode,
        });
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, 'localhost', () => {
    console.log(`App is running at the port ${port}`);
});