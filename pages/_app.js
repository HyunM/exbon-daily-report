import "../styles.css";
import "../components/main/Timesheet.css";
import { Provider } from "react-redux";
import { useStore } from "../store";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
