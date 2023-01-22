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
import { SlLock } from "react-icons/sl";
import Lottie from "lottie-react";
import ResetPasswordLottie from "../assets/lotties/reset-password.json";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slices/authSlice";
import { useNavigate, Navigate, Link } from "react-router-dom";

const ResetPassword = () => {
  useEffect(() => {
    document.title = `Reset Password | ONetwork Forum`;
  }, []);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.resetPassword
  );

  const queryParameters = new URLSearchParams(window?.location?.search);
  const token = queryParameters?.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword || !token) return;
    try {
      dispatch(resetPassword({ token, newPassword, confirmNewPassword }));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {!token && <Navigate to="/forgot-password" />}
      {token && token?.length > 0 && (
        <Row className="auth-form justify-content-center">
          <div className="bg-wrapper">
            <div className="bg">
              <Image src="https://res.cloudinary.com/djuxwysbl/image/upload/v1674230232/bg_ywi34h.svg" />
            </div>
          </div>
          <Col
            className="d-flex align-items-center justify-content-center"
            lg={6}
          >
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {isLoading && <div className="loader"></div>}
                  <h3 className="text-center">Reset Your Password</h3>
                  <Lottie animationData={ResetPasswordLottie} />
                  {message && (
                    <div
                      className={`message ${isError ? "error" : ""} ${
                        isSuccess ? "success" : ""
                      } ${isLoading ? "info" : ""}`}
                    >
                      {`${message} `}
                      {message?.includes("token is invalid") && (
                        <Link onClick={() => navigate("/forgot-password")}>
                          Click here to request it.
                        </Link>
                      )}
                      {message?.includes("token is expired") && (
                        <Link onClick={() => navigate("/forgot-password")}>
                          Click here to request it.
                        </Link>
                      )}
                    </div>
                  )}
                  <Form.Group>
                    <Form.Label htmlFor="newPassword">New Password:</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        <SlLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        disabled={isLoading}
                        placeholder="***********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="confirmNewPassword">
                      Confirm New Password:
                    </Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        <SlLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        disabled={isLoading}
                        placeholder="***********"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button
                    disabled={isLoading}
                    className="auth-submit mb-4 w-100"
                    type="submit"
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ResetPassword;
