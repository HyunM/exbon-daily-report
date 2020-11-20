const mssql = require("mssql");
const dbserver = require("../../../dbConfig.js");

const calendarHandler = (req, res) => {
  const { method, body, query } = req;
  return new Promise(resolve => {
    switch (method) {
      case "GET":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const sqlQuery = `SELECT DE.[ID]
                          ,(DE.LastName + ' ' + DE.FirstName) as 'EmployeeName'
                          ,CONVERT(nvarchar(10),DEA.[ProjectID])  + ' - ' + DP.Name as 'title'
                          ,DEA.[ProjectID]
                          ,DP.Name as 'ProjectName'
                          ,DATEADD(hour, 23, CONVERT(datetime, DEA.[StartDate])) as 'start'
                          ,DATEADD(hour, 23, CONVERT(datetime, DEA.[EndDate])) as 'end'
                          ,DEA.Position as 'EmployeePosition'
                          
                          FROM [Exbon].[dbo].[DispatchEmployeeAssignment] DEA with(nolock)

                          INNER JOIN [Exbon].[dbo].[DispatchProject] DP with(nolock) 
                                  ON DEA.ProjectID = DP.ID

                          INNER JOIN [Exbon].[dbo].[DispatchEmployee] DE with(nolock)
                                  ON DEA.EmployeeID = DE.ID
                                  
                          WHERE DE.ID = ${query.id}
                          
                          ORDER BY DEA.StartDate`;

          request.query(sqlQuery, (err, recordset) => {
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

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default calendarHandler;
