import { useEffect, useState, useMemo, useRef } from "react";
import { Form, Row, Button, Col, Image, Container } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/slices/profileSlice";
import {
  updateUserProfile,
  resetUpdateProfile,
} from "../redux/slices/authSlice";
import { RiUploadCloudFill } from "react-icons/ri";
import FormData from "form-data";
import SkeletonEditProfile from "../components/Skeletons/SkeletonEditProfile";

const EditProfile = () => {
  const { username } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user"))?.username;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileIsLoading } = useSelector((state) => state.profile);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth.updateUserProfileState
  );

  useEffect(() => {
    if (username)
      document.title = `${username} - Edit Profile | ONetwork Forum`;
  }, [username]);

  useEffect(() => {
    dispatch(getUserProfile(username));
  }, [dispatch, username]);

  useEffect(() => {
    dispatch(resetUpdateProfile());
  }, [dispatch]);

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState();
  const [twitter, setTwitter] = useState();
  const [github, setGithub] = useState();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const avatarRef = useRef();
  const coverRef = useRef();

  const changeHandler = (event) => {
    if (event.target.name === "avatar") {
      setAvatar(event.target.files[0]);
    }
    if (event.target.name === "cover") {
      setCover(event.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("userName", userName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("password", password);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    formData.append("avatar", avatar);
    formData.append("cover", cover);
    var obj = {};
    for (let key of formData.keys()) {
      obj[key] = formData.get(key);
    }
    dispatch(updateUserProfile(obj));
  };

  // eslint-disable-next-line
  return useMemo(() => {
    if (loggedUser && loggedUser !== username)
      return <Navigate to={`/user/${loggedUser}/edit`} />;
    if (profileIsLoading) return <SkeletonEditProfile />;
    if (!profileIsLoading && user && Object.entries(user).length > 0) {
      return (
        <main>
          <Container>
            <Row className="edit-profile">
              <Form
                encType="multipart/form-data"
                className="d-flex floating"
                onSubmit={handleSubmit}
              >
                <Col lg={8}>
                  <div className="right">
                    {isLoading && <div className="loader"></div>}
                    {message && (
                      <div
                        className={`message ${isError ? "error" : ""} ${
                          isSuccess ? "success" : ""
                        } ${isLoading ? "info" : ""}`}
                      >
                        {message}
                      </div>
                    )}
                    <section>
                      <h5 className="section-title">basic info</h5>
                      <div className="section-content">
                        <Row className="mb-3">
                          <Form.Group className="form-group" as={Col}>
                            <Form.Control
                              type="text"
                              placeholder="firstname"
                              disabled={isLoading}
                              value={firstname}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                            <Form.Label>first name</Form.Label>
                          </Form.Group>
                          <Form.Group className="form-group" as={Col}>
                            <Form.Control
                              type="text"
                              placeholder="lastname"
                              disabled={isLoading}
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
                            />
                            <Form.Label>last name</Form.Label>
                          </Form.Group>
                        </Row>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="text"
                            placeholder="username"
                            disabled={isLoading}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          <Form.Label>username</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="email"
                            placeholder="email"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Form.Label>email</Form.Label>
                        </Form.Group>
                      </div>
                    </section>
                    <section>
                      <h5 className="section-title">about</h5>
                      <div className="section-content">
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            as="textarea"
                            placeholder="bio"
                            disabled={isLoading}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          />
                          <Form.Label>biography</Form.Label>
                        </Form.Group>
                      </div>
                    </section>
                    <section>
                      <h5 className="section-title">external links</h5>
                      <div className="section-content">
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="text"
                            placeholder="facebook"
                            disabled={isLoading}
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                          />
                          <Form.Label>facebook URL</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="text"
                            placeholder="twitter"
                            disabled={isLoading}
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                          />
                          <Form.Label>twitter URL</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="text"
                            placeholder="github"
                            disabled={isLoading}
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                          />
                          <Form.Label>github URL</Form.Label>
                        </Form.Group>
                      </div>
                    </section>
                    <section>
                      <h5 className="section-title">security</h5>
                      <div className="section-content">
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="password"
                            placeholder="password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Form.Label>current password</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="password"
                            placeholder="new password"
                            disabled={isLoading}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <Form.Label>new password</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                          <Form.Control
                            type="password"
                            placeholder="confirm new password"
                            disabled={isLoading}
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                          />{" "}
                          <Form.Label>confirm new password</Form.Label>
                        </Form.Group>
                      </div>
                    </section>
                    <div className="edit-actions d-flex justify-content-end">
                      <Button type="submit">save</Button>
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="left">
                    {isLoading && <div className="loader"></div>}
                    <section className="profile">
                      <h5 className="section-title">profile</h5>
                      <div className="section-content">
                        <div className="upload-avatar d-flex flex-column">
                          <div className="user-avatar d-flex">
                            <Image src={user?.avatar?.url} />
                          </div>
                          <div className="user-info">
                            <h5 className="user-name">
                              {user?.firstName} {user?.lastName}
                            </h5>
                            <span className="username">@{user?.username}</span>
                          </div>
                          <Form.Control
                            name="avatar"
                            accept="image/*"
                            disabled={isLoading}
                            ref={avatarRef}
                            onChange={changeHandler}
                            type="file"
                            hidden
                          />
                          <Button
                            disabled={isLoading}
                            onClick={() => avatarRef.current.click()}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <RiUploadCloudFill />
                            upload new avatar
                          </Button>
                          <span className="size-note">
                            Recommended size: 400x400px
                          </span>
                        </div>
                        <div className="upload-header-cover d-flex flex-column">
                          <div className="user-cover">
                            <Image src={user?.cover?.url} />
                          </div>
                          <Form.Control
                            name="cover"
                            accept="image/*"
                            disabled={isLoading}
                            ref={coverRef}
                            onChange={changeHandler}
                            type="file"
                            hidden
                          />
                          <Button
                            disabled={isLoading}
                            onClick={() => coverRef.current.click()}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <RiUploadCloudFill />
                            upload new header cover
                          </Button>
                          <span className="size-note">
                            Recommended size: 1920x620px
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                </Col>
              </Form>
            </Row>
          </Container>
        </main>
      );
    }
  });
};

export default EditProfile;
