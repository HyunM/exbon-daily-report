const testHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        // Requiring module
        const reader = require("xlsx");

        // Reading our test file
        const filetest = "./test.xlsx";
        const file = reader.readFile(filetest);

        // Sample data set
        let student_data = [
          {
            Student: "Nikhil",
            Age: 22,
            Branch: "ISE",
            Marks: 70,
          },
          {
            Name: "Amitha",
            Age: 21,
            Branch: "EC",
            Marks: 80,
          },
        ];

        const ws = reader.utils.json_to_sheet(student_data);

        reader.utils.book_append_sheet(file, ws, "Sheet3");

        // Writing to our file
        reader.writeFile(file, "./test2.xlsx");

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default testHandler;
