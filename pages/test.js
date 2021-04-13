import axios from "axios";

const test = () => {
  const inNode = () => {
    let ProjectName = "TEST";
    axios({
      method: "post",
      url: `/api/test`,
      timeout: 1000000, // 2 seconds timeout
      headers: {},
      data: {
        ProjectName: ProjectName,
      },
    });
  };
  const inReact = () => {
    let ProjectName = "TEST";
  };
  return (
    <div>
      <button onClick={inNode}>Nodejs EXCEL</button>
      <button onClick={inReact}>React EXCEL</button>
    </div>
  );
};

export default test;
