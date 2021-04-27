const exportHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        const handle = async () => {
          var Excel = require("exceljs");
          var __dirname = "public";
          let filename = "/6 R Daily Report.xlsx";
          let workbook = new Excel.Workbook();
          await workbook.xlsx.readFile(__dirname + filename);
          let worksheet = workbook.getWorksheet("Daily Report");
          // header id name dob
          let row = worksheet.getRow(2);
          row.getCell(2).value = body.ProjectName;
          row.commit();
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
