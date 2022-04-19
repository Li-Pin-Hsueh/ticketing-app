// Use global bootstrap in custom <APP>
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Hi there! {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys('appContext: ', appContext));
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  // INVOK LandingPage component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  // console.log(data);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
