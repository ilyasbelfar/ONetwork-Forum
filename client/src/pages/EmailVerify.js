import {
  Row,
  Col,
  Image,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RiUserAddLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  sendEmailVerification,
  emailVerify,
  resetVerifyEmail,
} from "../redux/slices/authSlice";
import Lottie from "lottie-react";
import emailAnimation from "../assets/lotties/email.json";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.sendEmailVerify
  );
  const emailVerifyState = useSelector((state) => state.auth.emailVerify);

  const queryParameters = new URLSearchParams(window?.location?.search);
  const token = queryParameters?.get("token");

  useEffect(() => {
    document.title = `Email Verification | ONetwork Forum`;
  }, []);

  useEffect(() => {
    dispatch(resetVerifyEmail());
    if (token && token.length > 0) {
      dispatch(emailVerify({ token }));
    }
  }, [dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      dispatch(sendEmailVerification({ email }));
    } catch (err) {
      console.log(err.message);
    }
  };
  // eslint-disable-next-line
  return useMemo(() => {
    return (
      <Row className="auth-form justify-content-center">
        <div className="bg-wrapper">
          <div className="bg">
            <Image src="https://res.cloudinary.com/djuxwysbl/image/upload/v1674230232/bg_ywi34h.svg" />
          </div>
        </div>
        {token && token?.length > 0 ? (
          <>
            <Col
              className="d-flex align-items-center justify-content-center"
              lg={6}
            >
              <Card>
                <Card.Body>
                  <Lottie animationData={emailAnimation} />
                  {emailVerifyState.isLoading && <div className="loader"></div>}
                  <div
                    className={`message ${
                      emailVerifyState.isError && "error"
                    } ${emailVerifyState.isSuccess && "success"} ${
                      emailVerifyState.isLoading && "info"
                    }`}
                  >
                    {emailVerifyState.isLoading && "Verifying your email..."}
                    {!emailVerifyState.isLoading &&
                      `${emailVerifyState.message} `}
                    {emailVerifyState?.message?.includes(
                      "token is expired"
                    ) && (
                      <Link onClick={() => navigate("/verify-email")}>
                        Click here to request it.
                      </Link>
                    )}
                    {emailVerifyState?.message?.includes(
                      "token is invalid"
                    ) && (
                      <Link onClick={() => navigate("/verify-email")}>
                        Click here to request it.
                      </Link>
                    )}
                    {emailVerifyState?.isSuccess && (
                      <Link to="/login">Click here to login.</Link>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        ) : (
          <Col
            className="d-flex align-items-center justify-content-center"
            lg={6}
          >
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {isLoading && <div className="loader"></div>}
                  <h3 className="text-center">Verify your email</h3>
                  {message && (
                    <div
                      className={`message ${isError ? "error" : ""} ${
                        isSuccess ? "success" : ""
                      } ${isLoading ? "info" : ""}`}
                    >
                      {message}
                    </div>
                  )}
                  <p className="text-center">
                    Enter your email address below to receive an activation
                    link.
                  </p>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="someone@example.com"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button className="auth-submit mb-4 w-100" type="submit">
                    Verify
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    );
  });
};

export default EmailVerify;
