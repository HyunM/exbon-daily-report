const exportHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        const handle = async () => {
          var __dirname = "public";
          var Excel = require("exceljs");
          let filename = "/6 R Daily Report.xlsx";
          let workbook = new Excel.Workbook();
          await workbook.xlsx.readFile(__dirname + filename);
          let worksheet = workbook.getWorksheet("Daily Report");
          // header id name dob
          let row2 = worksheet.getRow(2);
          let row3 = worksheet.getRow(3);
          let row4 = worksheet.getRow(4);
          let row5 = worksheet.getRow(5);
          row2.getCell(2).value = body.ProjectName;
          row2.getCell(6).value = body.Date;

          row3.getCell(6).value = body.ProjectID;

          row4.getCell(6).value = body.StartTime;

          row5.getCell(2).value = body.Weather;
          row5.getCell(6).value = body.EndTime;

          workbook.xlsx.writeFile(__dirname + "/export.xlsx");
        };

        handle();

        res.status(200).json({
          message: "Success",
        });
        return resolve();
        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default exportHandler;
