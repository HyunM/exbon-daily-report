const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const projectActivityHandler = (req, res) => {
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
          const projectID = req.query.projectID;

          const query = `EXEC [Hammer].[dbo].[ProjectActivity_SelectByPIDandDate]
          ${projectID}, '${selectedDate}'`;

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              result: recordset.recordsets,
            });
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

          const query = `EXEC [Hammer].[dbo].[ProjectActivity_UpdateOrInsert]
          ${body.ProjectID}, "${body.Date}", '${body.Tests}', '${body.Correctional}', '${body.Note}'`;
          /* --Params--
          	@projectID int,
            @date date,
            @tests nvarchar(1000),
            @correctional nvarchar(1000),
            @note nvarchar(1000)
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              message: "Success.",
              ActivityID: recordset.recordset[0].ActivityID,
            });
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default projectActivityHandler;
