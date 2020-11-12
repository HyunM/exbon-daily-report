const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const projectTasksProgressHandler = (req, res) => {
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

          const query = `EXEC [Hammer].[dbo].[ProjectTaskProgress_SelectByDate]
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

          const query = `EXEC [Hammer].[dbo].[ProjectTaskProgress_Insert]
          ${body.TaskID}, "${body.Date}", ${body.WorkCompleted}`;
          /* --Params--
          	@taskID	int,
            @date date,
            @workCompleted float
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              message: "Success, the record of task progress has been created.",
            });
            return resolve();
          });
        });
        break;

      case "PUT":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const query = `EXEC [Hammer].[dbo].[ProjectTaskProgress_DeleteAndInsert]
            ${body.TaskID}, '${body.Date}', '${body.WorkCompleted}'`;
          /* --Params--
            @taskID int,
            @date int,
            @workCompleted float,
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }

            res.status(200).json({
              message: "Success, the record has been deleted and inserted.",
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

export default projectTasksProgressHandler;
