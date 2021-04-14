const testHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        const handle = async () => {
          var Excel = require("exceljs");
          var __dirname = "public";
          let filename = "/6 Daily Report.xltx";
          let workbook = new Excel.Workbook();
          await workbook.xlsx.readFile(__dirname + filename);
          let worksheet = workbook.getWorksheet("Daily Report");
          // header id name dob
          let row = worksheet.getRow(2);
          console.log(row);
          row.getCell(2).value = body.ProjectName;
          row.commit();
          workbook.xlsx.writeFile(__dirname + "/6 Daily Report - Test.xlsx");
        };
        handle();
        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default testHandler;
