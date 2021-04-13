const testHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        var Excel = require("exceljs");
        var workbook = new Excel.Workbook();
        var __dirname = "public";
        workbook.xlsx.readFile(__dirname + "/test.xlsx").then(function () {
          var worksheet = workbook.getWorksheet(1);
          var row = worksheet.getRow(5);
          row.getCell(1).value = 5; // A5's value set to 5
          row.commit();
          return workbook.xlsx.writeFile("new.xlsx");
        });

      // case "POST":
      //   // Requiring module
      //   const reader = require("xlsx");

      //   // Reading our test file
      //   const __dirname = "public";
      //   const file = reader.readFile(__dirname + "/test.xlsx");

      //   // Sample data set
      //   let student_data = [
      //     {
      //       Student: "Nikhil",
      //       Age: 22,
      //       Branch: "ISE",
      //       Marks: 70,
      //     },
      //     {
      //       Name: "Amitha",
      //       Age: 21,
      //       Branch: "EC",
      //       Marks: 80,
      //     },
      //   ];

      //   reader.utils.book_append_sheet(file, ws, "TEST");

      //   // Writing to our file
      //   reader.writeFile(file, __dirname + "/test2.xlsx");

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default testHandler;
