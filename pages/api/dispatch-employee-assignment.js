const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const dispatchEmployeeAssignmentHandler = (req, res) => {
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

          const query = `SELECT DEA.[EmployeeID]
                        ,E.LastName + ' ' + E.FirstName as 'title'
                        ,DEA.[ProjectID]
                        ,DP.Name as 'ProjectName'
                        ,DATEADD(hour, 23, CONVERT(datetime, DEA.[StartDate])) as 'start'
                        ,DATEADD(hour, 23, CONVERT(datetime, DEA.[EndDate])) as 'end'
                        ,DEA.Position as 'EmployeePosition'

                        FROM [Exbon].[dbo].[DispatchEmployeeAssignment] DEA with(nolock)
                        
                        INNER JOIN [Exbon].[dbo].[DispatchProject] DP with(nolock) 
                                ON DEA.ProjectID = DP.ID

                        INNER JOIN [Exbon].[dbo].[Employee] E with(nolock)
                                ON DEA.EmployeeID = E.EmployeeID`;

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

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default dispatchEmployeeAssignmentHandler;
