import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page...</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  // Trick to solve cross domain issue
  if (typeof window === "undefined") {
    // console.log(req.headers);
    // running on the SERVER
    // ACCESS api via ingress-nginx server
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
    console.log("RUNNING on SERVER");
    const { data } = await axios
      .get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: req.headers
        }
      )
      .catch((err) => {
        console.log(err);
      });

    return data;
  } else {
    // running on the browser
    // request can be made with a base url of ''
    console.log("RUNNING on BROWSER");
    const { data } = await axios.get("/api/users/currentuser").catch((err) => {
      console.log(err);
    });

    return data;
  }
};

export default LandingPage;
