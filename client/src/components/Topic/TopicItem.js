import { Button, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GiPlayButton } from "react-icons/gi";
import { SiGooglemessages } from "react-icons/si";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleUpvoteTopic,
  toggleDownvoteTopic,
} from "../../redux/slices/topicSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const TopicItem = ({ topic }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("user"))?.username;
  const isAuth = localStorage.getItem("isLoggedIn") ? true : false;
  const { votingIsLoading } = useSelector((state) => state.topic);

  const handleToggleUpvoteTopic = (id) => {
    dispatch(toggleUpvoteTopic(id));
  };

  const handleToggleDownvoteTopic = (id) => {
    dispatch(toggleDownvoteTopic(id));
  };

  return (
    <article className="topic-item">
      <div className="topic-vote d-flex flex-column align-items-center">
        <Button
          disabled={votingIsLoading}
          onClick={() => {
            if (!isAuth) navigate("/login");
            if (isAuth) handleToggleUpvoteTopic(topic._id);
          }}
          className={
            username && topic?.upvotes?.includes(username) ? "upvoted" : ""
          }
        >
          <GiPlayButton />
        </Button>
        <span
          className={`votes ${
            username && topic?.upvotes?.includes(username) ? "upvoted" : ""
          }${
            username && topic?.downvotes?.includes(username) ? "downvoted" : ""
          }`}
        >
          {topic?.upvotes?.length - topic?.downvotes?.length}
        </span>
        <Button
          disabled={votingIsLoading}
          onClick={() => {
            if (!isAuth) navigate("/login");
            if (isAuth) handleToggleDownvoteTopic(topic._id);
          }}
          className={
            username && topic?.downvotes?.includes(username) ? "downvoted" : ""
          }
        >
          <GiPlayButton />
        </Button>
      </div>
      <div className="topic-item-content">
        <Nav as="ul" className="tags">
          {topic?.tags?.length > 0 &&
            topic?.tags?.map((tag, i) => {
              return (
                <Nav.Item key={i} as="li">
                  <Nav.Link>{tag?.name}</Nav.Link>
                </Nav.Item>
              );
            })}
        </Nav>
        <Link to={`/topics/${topic?.TopicID}/${topic?.slug}`}>
          <h4 className="topic-title">{topic?.title}</h4>
        </Link>
        <p className="topic-summary">{topic?.content}</p>
        <div className="topic-meta d-flex align-items-center">
          <div className="topic-writer d-flex align-items-center">
            <Link
              className="d-flex align-items-center justify-content-center"
              to={`/user/${topic?.author?.username}`}
            >
              <Image src={topic?.author?.avatar?.url} />
              <h5 className="writer">{`${topic?.author?.firstName} ${topic?.author?.lastName}`}</h5>
            </Link>
            <p className="topic-date">
              Posted{" "}
              {moment
                .utc(topic?.createdAt)
                .local()
                .startOf("seconds")
                .fromNow()}
            </p>
          </div>
          <div className="topic-stats d-flex">
            <span className="answers d-flex align-items-center">
              <div className="icon-container d-flex">
                <SiGooglemessages />
              </div>
              {topic?.totalComments}
            </span>
            <span className="views d-flex align-items-center">
              <div className="icon-container d-flex">
                <FaEye />
              </div>
              {topic?.viewsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TopicItem;
