import { Col, Image, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getTopic } from "../redux/slices/topicSlice";
import CommentForm from "../components/Comment/CommentForm";
import { resetTopics } from "../redux/slices/topicSlice";
import CommentsContainer from "../components/Comment/CommentsContainer";
import TopicContent from "../components/Topic/TopicContent";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import SkeletonTopicPage from "../components/Skeletons/SkeletonTopicPage";

const Topic = () => {
  const { id, slug } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const {
    topic,
    message,
    getTopicIsLoading,
    deleteTopicIsLoading,
    isError,
    isSuccess,
  } = useSelector((state) => state.topic);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (topic && Object?.keys(topic)?.length > 0) {
      document.title = `${topic?.title} | ONetwork Forum`;
    }
  }, [topic]);

  useEffect(() => {
    dispatch(resetTopics());
    dispatch(getTopic({ id, slug }));
  }, [dispatch, id, slug]);

  return useMemo(() => {
    return (
      <main>
        <Container className="d-flex justify-content-between">
          <Col lg={8}>
            {message && (
              <div
                className={`message ${isError ? "error" : ""} ${
                  isSuccess ? "success" : ""
                } ${deleteTopicIsLoading ? "info" : ""}`}
              >
                {message}
              </div>
            )}
            {getTopicIsLoading && <SkeletonTopicPage />}
            {!getTopicIsLoading && topic && Object?.keys(topic)?.length > 0 && (
              <article className="topic-item thread">
                {isDeleting && <div className="loader"></div>}
                <div className="thread-content">
                  <TopicContent
                    onDeleting={() => setIsDeleting(true)}
                    topic={topic}
                  />
                  <div className="add-comment d-flex pt-5 pr-5 pl-5">
                    <Image src={user?.avatar?.url} />
                    <CommentForm passedComment={null} topic={topic} />
                  </div>
                  <CommentsContainer topic={topic} />
                </div>
              </article>
            )}
          </Col>
          <RightSidebar />
        </Container>
      </main>
    );
  }, [
    topic,
    message,
    getTopicIsLoading,
    isDeleting,
    deleteTopicIsLoading,
    isError,
    isSuccess,
    user?.avatar?.url,
  ]);
};

export default Topic;
