import { useEffect, useState } from "react";
import {
  InputGroup,
  Row,
  Col,
  Form,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SlLock } from "react-icons/sl";
import { RiUserAddLine } from "react-icons/ri";
import { login, resetLogin } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.login
  );

  useEffect(() => {
    document.title = `Login | ONetwork Forum`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      dispatch(login({ email, password }));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    dispatch(resetLogin());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
              <h3 className="text-center">Login</h3>
              <p className="text-center">
                Welcome to ONetwork, a platform to connect with the world.
              </p>
              {message && (
                <div
                  className={`message ${isError ? "error" : ""} ${
                    isSuccess ? "success" : ""
                  } ${isLoading ? "info" : ""}`}
                >
                  {`${message} `}
                  {message?.includes("must activate") && (
                    <Link to="/verify-email">Click here to activate it.</Link>
                  )}
                </div>
              )}
              <Form.Group>
                <Form.Label htmlFor="email">
                  Username or Email Address:
                </Form.Label>
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
              <Form.Group>
                <Form.Label htmlFor="password">Your Password</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <SlLock />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    disabled={isLoading}
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Form.Group controlId="rememberme">
                  <Form.Check
                    name="rememberme"
                    id="rememberme"
                    type="checkbox"
                    label="Remember Me"
                  ></Form.Check>
                </Form.Group>
                <Link className="forget-pwd" to="/forgot-password">
                  Forget password?
                </Link>
              </div>
              <Button
                className="auth-submit mb-4 w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Login"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
