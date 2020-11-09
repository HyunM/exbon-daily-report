// Fake users data
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];

const handler = (req, res) => {
  // Get data from your database
  res.status(200).json(users);
};

export default handler;
