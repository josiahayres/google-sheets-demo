const { GoogleSpreadsheet } = require("google-spreadsheet");

exports.handler = async function (event, context) {
  // your server-side functionality
  const date = event.queryStringParameters?.date;
  const code = event.queryStringParameters?.code;

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  try {
    if (!code) {
      throw new Error("Missing code");
    }
    if (!date) {
      throw new Error("Missing date");
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    });

    await doc.getInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const todaysQuestionsIndex = rows.findIndex(
      (eachRow) => eachRow["code"] === code && eachRow["date"] === date
    );

    if (todaysQuestionsIndex === -1) {
      return {
        statusCode: 500,
        body: `Row not found for ${code} and ${date}`,
      };
    }

    const data = {
      code: rows[todaysQuestionsIndex]["code"],
      date: rows[todaysQuestionsIndex]["date"],
      rowId: todaysQuestionsIndex,
      q1: rows[todaysQuestionsIndex]["q1"],
      q2: rows[todaysQuestionsIndex]["q2"],
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
