const { GoogleSpreadsheet } = require("google-spreadsheet");

exports.handler = async function (event, context) {
  // your server-side functionality
  const rowId = event.queryStringParameters?.rowId;
  const date = event.queryStringParameters?.date;
  const code = event.queryStringParameters?.code;
  const questionId = event.queryStringParameters?.questionId;
  const value = event.queryStringParameters?.value;

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  try {
    if (!rowId) {
      throw new Error("Missing rowId");
    }
    if (!date) {
      throw new Error("Missing date");
    }
    if (!code) {
      throw new Error("Missing code");
    }
    if (!questionId) {
      throw new Error("Missing questionId");
    }
    if (!value) {
      throw new Error("Missing value");
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    });

    await doc.getInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows[Number(rowId)];

    if (row["date"] !== date || row["code"] !== code) {
      throw new Error("Parameters do not match database");
    }

    row[questionId] = value;
    await row.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
