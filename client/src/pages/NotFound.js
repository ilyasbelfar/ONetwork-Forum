import { Row } from "react-bootstrap";
import Lottie from "lottie-react";
import Error404 from "../assets/lotties/error-404-not-found.json";

const NotFound = () => {
  document.title = "Page Not Found | ONetwork Forum";
  return (
    <Row className="auth-form justify-content-center">
      <div className="bg-wrapper">
        <div
          style={{
            display: "inline-block",
            maxWidth: `534px`,
            transformOrigin: `center center`,
          }}
          className="bg"
        >
          <Lottie animationData={Error404} />
        </div>
      </div>
    </Row>
  );
};

export default NotFound;
