import { useMemo, memo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Image, Nav } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import {
  RiBallPenFill,
  RiTwitterFill,
  RiGithubFill,
  RiFacebookFill,
} from "react-icons/ri";
import { SiGooglemessages } from "react-icons/si";
import { TiGroup } from "react-icons/ti";
import { FaUserCheck, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/profileSlice";
import FollowButton from "./FollowButton";
import SkeletonProfileHeader from "../Skeletons/SkeletonProfileHeader";

const ProfileHeader = memo(() => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { userProfile, profileIsLoading } = useSelector(
    (state) => state.profile
  );
  const loggedUser = JSON.parse(localStorage.getItem("user"))?.username;

  useEffect(() => {
    if (username) document.title = `${username} Profile | ONetwork Forum`;
  }, [username]);

  useMemo(() => {
    dispatch(getUserProfile(username));
  }, [dispatch, username]);

  // eslint-disable-next-line
  return useMemo(() => {
    if (profileIsLoading) {
      return <SkeletonProfileHeader />;
    }
    if (
      !profileIsLoading &&
      userProfile &&
      Object.entries(userProfile)?.length > 0
    ) {
      return (
        <div className="profile-header">
          <div
            className="user-profile-meta d-flex align-items-center"
            style={{
              backgroundImage: `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.5)
    ),
    url(${userProfile?.cover?.url})`,
            }}
          >
            <Link
              to={`/user/${userProfile?.username}`}
              className="user-avatar d-flex"
            >
              <Image src={userProfile?.avatar?.url} />
            </Link>
            <div className="user-info d-flex flex-column">
              <h4 className="user-name">{`${userProfile?.firstName} ${userProfile?.lastName}`}</h4>
              <div className="user-bio">{userProfile?.bio}</div>
              <div className="user-meta">
                <span className="user-id">#{userProfile?.userID}</span>
                <span className="username">@{userProfile?.username}</span>
                <span className="user-website">sphinxo.dev</span>
              </div>
              <div className="user-actions">
                {username === loggedUser && (
                  <Link to={`/user/${userProfile?.username}/edit`}>
                    <Button className="edit d-inline-flex align-items-center">
                      <MdEdit />
                      Edit Profile
                    </Button>
                  </Link>
                )}
                <FollowButton passedUser={userProfile} />
              </div>
            </div>
          </div>
          <div className="profile-header-section">
            <div className="social-links">
              <a
                href={userProfile?.socialNetwork?.facebook}
                className="facebook"
              >
                <RiFacebookFill />
              </a>
              <a href={userProfile?.socialNetwork?.twitter} className="twitter">
                <RiTwitterFill />
              </a>
              <a href={userProfile?.socialNetwork?.github} className="github">
                <RiGithubFill />
              </a>
            </div>
            <Nav as="ul" className="profile-menu">
              <Nav.Link
                as={Link}
                to={`/user/${userProfile?.username}/topics`}
                eventKey="topics"
                className="d-flex align-items-center"
              >
                <div className="d-flex icon-container">
                  <RiBallPenFill />
                </div>
                Topics Created
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/user/${userProfile?.username}/upvotes`}
                eventKey="upvotes"
                className="d-flex align-items-center"
              >
                <div className="d-flex icon-container">
                  <FaThumbsUp />
                </div>
                Upvoted Topics
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/user/${userProfile?.username}/comments`}
                eventKey="comments"
                className="d-flex align-items-center"
              >
                <div className="d-flex icon-container">
                  <SiGooglemessages />
                </div>
                Comments
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/user/${userProfile?.username}/following`}
                eventKey="following"
                className="d-flex align-items-center"
              >
                <div className="d-flex icon-container">
                  <FaUserCheck />
                </div>
                Following
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/user/${userProfile?.username}/followers`}
                eventKey="followers"
                className="d-flex align-items-center"
              >
                <div className="d-flex icon-container">
                  <TiGroup />
                </div>
                Followers
              </Nav.Link>
            </Nav>
          </div>
        </div>
      );
    }
    // eslint-disable-next-line
  }, [userProfile, profileIsLoading]);
});

export default ProfileHeader;
