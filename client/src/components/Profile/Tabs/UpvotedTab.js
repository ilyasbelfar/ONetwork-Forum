import { useEffect, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllTopics, resetTopics } from "../../../redux/slices/topicSlice";
import TopicItem from "../../Topic/TopicItem";
import { resetUserComments } from "../../../redux/slices/profileSlice";
import SkeletonTopicItem from "../../Skeletons/SkeletonTopicItem";

const UpvotedTab = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  let { topics, getAllTopicsIsLoading } = useSelector((state) => state.topic);

  useEffect(() => {
    dispatch(resetTopics());
    dispatch(resetUserComments());
    dispatch(getAllTopics("latest", ""));
  }, [dispatch]);

  topics = topics.filter((t) => t.upvotes.includes(username));

  return useMemo(() => {
    return (
      <>
        <Row className="profile-info">
          <Col>
            <div className="tab-ui">
              <h6 className="tab-title">Upvoted Topics</h6>
              <Row>
                {getAllTopicsIsLoading && (
                  <>
                    <SkeletonTopicItem />
                  </>
                )}
                {!getAllTopicsIsLoading &&
                  topics.length > 0 &&
                  topics.map((topic) => (
                    <TopicItem key={topic._id} topic={topic} />
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }, [topics, getAllTopicsIsLoading]);
};
export default UpvotedTab;
