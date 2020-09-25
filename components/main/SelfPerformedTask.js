import { useState } from "react";

const SelfPerformedTask = () => {
  return (
    <>
      <h1>Self-Performed Task</h1>
      <table>
        <tbody>
          <tr>
            <th>Self-Performed Task</th>
            <th>FirstName</th>
            <th>Lastname</th>
          </tr>
          <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
          <tr>
            <td>John</td>
            <td>Doe</td>
            <td>80</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default SelfPerformedTask;
