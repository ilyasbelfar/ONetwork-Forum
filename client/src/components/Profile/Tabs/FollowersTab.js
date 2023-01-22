import { Col, Row, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserFollowers } from "../../../redux/slices/profileSlice";
import { useMemo } from "react";
import FollowButton from "../FollowButton";
import SkeletonFollowTab from "../../Skeletons/SkeletonFollowTab";

const FollowersTab = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  let { userFollowers, followIsLoading } = useSelector(
    (state) => state.profile
  );

  useMemo(() => {
    dispatch(getUserFollowers(username));
  }, [dispatch, username]);
  return useMemo(() => {
    return (
      <>
        <Row className="profile-info">
          <Col>
            <div className="tab-ui">
              <h6 className="tab-title">following</h6>
              <Row>
                {followIsLoading && (
                  <>
                    <SkeletonFollowTab />
                  </>
                )}
                {!followIsLoading &&
                  userFollowers.length > 0 &&
                  userFollowers?.map((user) => (
                    <Col key={user?._id} lg={12}>
                      <div className="follow-brief d-flex align-items-center">
                        <Image src={user?.avatar?.url} />
                        <div className="user-meta d-flex flex-column">
                          <h5 className="user-name">
                            {user?.firstName} {user?.lastName}
                          </h5>
                          <span className="username">@{user?.username}</span>
                          <span className="user-bio">{user?.bio}</span>
                        </div>
                        <FollowButton passedUser={user} />
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }, [userFollowers, followIsLoading]);
};

export default FollowersTab;
