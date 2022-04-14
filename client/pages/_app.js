// Use global bootstrap in custom <APP>
import "bootstrap/dist/css/bootstrap.css";

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;