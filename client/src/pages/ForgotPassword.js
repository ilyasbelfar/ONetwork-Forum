import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Col,
  Row,
  Image,
  Card,
  InputGroup,
} from "react-bootstrap";
import { RiUserAddLine } from "react-icons/ri";
import Lottie from "lottie-react";
import ForgotPasswordLottie from "../assets/lotties/forgot-password.json";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.forgotPassword
  );

  useEffect(() => {
    document.title = `Forgot Password | ONetwork Forum`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      dispatch(forgotPassword({ email }));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Row className="auth-form justify-content-center">
      <div className="bg-wrapper">
        <div className="bg">
          <Image src="https://res.cloudinary.com/djuxwysbl/image/upload/v1674230232/bg_ywi34h.svg" />
        </div>
      </div>
      <Col className="d-flex align-items-center justify-content-center" lg={6}>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {isLoading && <div className="loader"></div>}
              <h3 className="text-center">Forgot Password?</h3>
              <Lottie animationData={ForgotPasswordLottie} />
              <p className="text-center">
                Enter the email address associated with your account and we'll
                send you an email with instructions to reset your password.
              </p>
              {message && (
                <div
                  className={`message ${isError ? "error" : ""} ${
                    isSuccess ? "success" : ""
                  } ${isLoading ? "info" : ""}`}
                >
                  {message}
                </div>
              )}
              <Form.Group>
                <Form.Label htmlFor="email">Email Address:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <RiUserAddLine />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    id="email"
                    disabled={isLoading}
                    placeholder="someone@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Button
                disabled={isLoading}
                className="auth-submit mb-4 w-100"
                type="submit"
              >
                {isLoading ? "Sending..." : "Send E-mail"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
