const mssql = require("mssql");
const dbserver = require("../../../dbConfig.js");

export default function TimesheetHandler(req, res) {
  const {
    query: { TimesheetID },
    body,
    method,
  } = req;

  switch (method) {
    // case "GET":
    //   mssql.connect(dbserver.dbConfig, err => {
    //     if (err) {
    //       console.error(err);
    //       return resolve();
    //     }
    //     const request = new mssql.Request();

    //     const query = `SELECT [TimesheetID]
    //                     FROM [Hammer].[dbo].[Timesheet]
    //                     WHERE TimesheetID = ${TimesheetID}`;

    //     request.query(query, (err, recordset) => {
    //       if (err) {
    //         console.error(err);
    //         return resolve();
    //       }

    //       res.status(200).json(recordset.rowsAffected);
    //       return resolve();
    //     });
    //   });
    //   break;
    case "PUT":
      mssql.connect(dbserver.dbConfig, err => {
        if (err) {
          console.error(err);
        }
        const request = new mssql.Request();

        const query = `EXEC [Hammer].[dbo].[Timesheet_UpdateByTimesheetID]
          ${TimesheetID}, ${body.EmployeeID}, "${body.Trade}", "${body.WorkStart}",  "${body.WorkEnd}", "${body.MealStart}", "${body.MealEnd}"`;
        /* --Params--
        @timesheetID int,
        @employeeID int,
        @trade nvarchar(100),
        @workStart time(0),
        @workEnd time(0),
        @mealStart time(0),
        @mealEnd time(0)
        */

        request.query(query, (err, recordset) => {
          if (err) {
            console.error(err);
          }

          res.status(200).json("1");
        });
      });
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
