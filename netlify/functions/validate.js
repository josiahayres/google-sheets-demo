const { GoogleSpreadsheet } = require("google-spreadsheet");
const dayjs = require("dayjs");

function getToday() {
  return dayjs().format("DD-MM-YYYY");
}

/**
 * Connects to google spreadsheet
 * Find row with code
 *
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.handler = async function (event, context) {
  // your server-side functionality
  const code = event.queryStringParameters?.code;

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  try {
    if (!code) {
      console.log(event ? Object.keys(event) : "No event");
      throw new Error("Missing id");
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    });

    await doc.getInfo();
    const participantsSheet = doc.sheetsByIndex[1];
    const participantRows = await participantsSheet.getRows();

    // Check if user code exists
    const participantRowIndex = participantRows.findIndex(
      (eachRow) => eachRow["code"] === code
    );

    if (participantRowIndex === -1) {
      // User code does not exist
      return {
        statusCode: 200,
        body: JSON.stringify({
          validUser: false,
          message: "Invalid participant code",
        }),
      };
    }
    console.log(
      `Looked for row with code (${code}), found at index ${participantRowIndex}`
    );

    const formDataSheet = doc.sheetsByIndex[0];
    const formDataRows = await formDataSheet.getRows();
    const today = getToday();

    const todaysQuestionsIndex = formDataRows.findIndex(
      (eachRow) => eachRow["code"] === code && eachRow["date"] === today
    );

    if (todaysQuestionsIndex === -1) {
      const rowAdded = await formDataSheet.addRow({
        code,
        date: today,
        completed: false,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          validUser: true,
          completed: false,
          rowIndex: rowAdded.rowIndex,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        validUser: true,
        completed: formDataRows[todaysQuestionsIndex]["completed"] === "TRUE",
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
