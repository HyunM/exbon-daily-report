import Link from "next/link";

const NotPermission = () => {
  return (
    <>
      <h1>No permissions</h1>
      <Link href="/">
        <a>Go to main page</a>
      </Link>
    </>
  );
};

export default NotPermission;
