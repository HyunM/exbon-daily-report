import Link from "next/link";

const NotPermission = () => {
  return (
    <>
      <h1>No permissions</h1>
      <a href="/task-completion">Go to main page</a>
    </>
  );
};

export default NotPermission;
