import { Col, Row } from "react-bootstrap";
import { MdModeComment } from "react-icons/md";
import { BsClockFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getUserComments } from "../../../redux/slices/profileSlice";
import { useMemo } from "react";
import moment from "moment";
import SkeletonCommentsTab from "../../Skeletons/SkeletonCommentsTab";

const CommentsTab = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  let { userComments, commentsIsLoading } = useSelector(
    (state) => state.profile
  );

  useMemo(() => {
    dispatch(getUserComments(username));
  }, [dispatch, username]);

  return useMemo(() => {
    return (
      <>
        <Row className="profile-info">
          <Col>
            <div className="tab-ui">
              <h6 className="tab-title">Comments & Replies</h6>
              <Row>
                {commentsIsLoading && (
                  <>
                    <SkeletonCommentsTab />
                    <SkeletonCommentsTab />
                  </>
                )}
                {!commentsIsLoading &&
                  userComments.length > 0 &&
                  userComments.map((comment) => (
                    <Col
                      style={{ marginBottom: `2rem` }}
                      key={comment._id}
                      lg={12}
                    >
                      <div className="comment-type">
                        <MdModeComment />
                      </div>
                      <div className="comment-brief">
                        <div className="comment-meta d-flex align-items-center">
                          <h5 className="user-name">
                            {comment.author.firstName} {comment.author.lastName}
                            &nbsp;
                          </h5>
                          commented on&nbsp;
                          <Link
                            to={`/topics/${comment.parentTopic.TopicID}/${comment.parentTopic.slug}`}
                          >
                            <span className="topic-title">
                              {comment.parentTopic.title}
                            </span>
                          </Link>
                        </div>
                        <span className="comment-date d-flex align-items-center">
                          <div className="icon-container d-flex align-items-center">
                            <BsClockFill />
                          </div>
                          {moment
                            .utc(comment.createdAt)
                            .local()
                            .format("dddd, MMMM Do YYYY, HH:mm")}
                        </span>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }, [userComments, commentsIsLoading]);
};

export default CommentsTab;
