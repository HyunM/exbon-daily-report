const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const timesheetHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      mssql.connect(dbserver.dbConfig, err => {
        if (err) {
          console.error(err);
          return null;
        }
        const request = new mssql.Request();

        const selectedDate = req.query.selectedDate;

        const query = `EXEC [Hammer].[dbo].[Timesheet_SelectByDate]
        '${selectedDate}' `;

        request.query(query, (err, recordset) => {
          if (err) {
            console.error(err);
            return null;
          }
          const response = recordset.recordset;
          res.status(200).json(response);
        });
      });
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      res.status(404).end(`Failed`);
  }
};

export default timesheetHandler;
