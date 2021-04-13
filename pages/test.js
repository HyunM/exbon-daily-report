import axios from "axios";

const test = () => {
  const callapi = () => {
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
  return (
    <div>
      <button onClick={callapi}>TEST EXCEL</button>
    </div>
  );
};

export default test;
