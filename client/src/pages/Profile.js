import { Row, Col, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/Profile/ProfileHeader";

const Profile = () => {
  return (
    <>
      <main>
        <Container>
          <Row>
            <Col lg={10} className="profile mx-auto">
              <ProfileHeader />
              <Outlet />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

Profile.whyDidYouRender = true;

export default Profile;
