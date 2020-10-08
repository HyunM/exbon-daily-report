const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const timesheetHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "GET":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const selectedDate = req.query.selectedDate;

          const query = `EXEC [Hammer].[dbo].[Timesheet_SelectByDate]
          '${selectedDate}' `;

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            const response = recordset.recordset;
            res.status(200).json(response);
            return resolve();
          });
        });
        break;

      case "POST":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const query = `EXEC [Hammer].[dbo].[Timesheet_Insert]
          ${body.EmployeeID}, ${body.Trade}, ${body.Date}, '${body.WorkStart}', '${body.WorkEnd}', '${body.MealStart}', '${body.MealEnd}' `;
          /* --Params--
          @employeeID int,
          @trade nvarchar(100),
          @date date,
          @workStart time(0),
          @workEnd time(0),
          @mealStart time(0),
          @mealEnd time(0)
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json(recordset.rowsAffected);
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default timesheetHandler;
