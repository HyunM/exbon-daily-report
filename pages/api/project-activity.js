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

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default projectActivityHandler;
