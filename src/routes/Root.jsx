import { Link, Outlet, useNavigation } from "react-router-dom";

export default function Root() {
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">
        <div>
          <Link to="/">Google Sheets Demo</Link>
        </div>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
