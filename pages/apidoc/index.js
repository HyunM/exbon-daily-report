import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const index = () => {
  return (
    <>
      <SwaggerUI url="/DailyReport.yaml" />
    </>
  );
};

export default index;
