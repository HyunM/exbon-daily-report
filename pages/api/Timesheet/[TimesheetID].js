export default function TimesheetHandler(req, res) {
  const {
    query: { TimesheetID },
    method,
  } = req;

  switch (method) {
    // case "GET":
    //   res.status(200).json({ TimesheetID });
    //   break;
    case "PUT":
      res.status(200).json({ TimesheetID });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
