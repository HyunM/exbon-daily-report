const exportPDFHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(async resolve => {
    switch (method) {
      case "POST":
        const __dirname = "public";
        const Excel = require("exceljs");
        const filename = "/6 R Daily Report.xlsx";
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(__dirname + filename);
        const worksheet = workbook.getWorksheet("Daily Report");
        // header id name dob
        const row2 = worksheet.getRow(2);
        const row3 = worksheet.getRow(3);
        const row4 = worksheet.getRow(4);
        const row5 = worksheet.getRow(5);

        const row18 = worksheet.getRow(18);
        const row23 = worksheet.getRow(23);
        const row28 = worksheet.getRow(28);
        let rowData = [];

        const data = body.data;

        row2.getCell(2).value = body.ProjectName;
        row2.getCell(6).value = body.Date;

        row3.getCell(2).value = body.contractno;
        row3.getCell(6).value = parseInt(body.ProjectID);

        row4.getCell(2).value = body.fullname;
        row4.getCell(6).value = body.StartTime.substring(0, 5);

        row5.getCell(2).value = body.Weather;
        row5.getCell(6).value = body.EndTime.substring(0, 5);

        for (let i = 0; i < data.length; i++) {
          rowData.push(data[i]);
        }

        for (let i = 0; i < rowData.length; i++) {
          if (i === 8) break;
          worksheet.getRow(8 + i).getCell(1).value = rowData[i].Contractor;
          worksheet.getRow(8 + i).getCell(2).value = rowData[i].Trade;
          worksheet.getRow(8 + i).getCell(3).value = parseInt(
            rowData[i].Workers
          );
          worksheet.getRow(8 + i).getCell(4).value = parseFloat(
            rowData[i].Hours
          );
          worksheet.getRow(8 + i).getCell(5).value = rowData[i].Equipment;
          worksheet.getRow(8 + i).getCell(6).value = rowData[i].WorkPerformed;
        }

        row18.getCell(1).value = body.Tests;
        row23.getCell(1).value = body.Correctional;
        row28.getCell(1).value = body.Note;

        await workbook.xlsx.writeFile(
          __dirname + "/Daily Report_" + body.username + ".xlsx"
        );

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

export default exportPDFHandler;
