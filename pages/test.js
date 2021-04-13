import axios from "axios";

const test = () => {
  const inNode = () => {
    let ProjectName = document.getElementById("testinput").value;
    console.log(ProjectName);
    axios({
      method: "POST",
      url: `/api/test`,
      timeout: 1000000,
      headers: {},
      data: {
        ProjectName: ProjectName,
      },
    });
    alert("Edit Complete ! Click to download.");
  };

  return (
    <div>
      Project Name : <input id="testinput"></input>
      <br />
      <br />
      <br />
      <button onClick={inNode}>EDIT EXCEL</button>
      <br />
      <br />
      <br />
      <a href="/6 Daily Report - Test.xlsx" download>
        Click to download
      </a>
    </div>
  );
};

export default test;
