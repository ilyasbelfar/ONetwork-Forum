import { Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const SkeletonCommentsTab = () => {
  return (
    <Col style={{ marginBottom: `2rem` }} lg={12}>
      <div className="d-flex align-items-center">
        <span style={{ marginRight: `8px` }}>
          <Skeleton circle width={50} height={50} />
        </span>
        <span>
          <Skeleton width={600} />
        </span>
      </div>
      <div className="comment-brief">
        <div className="comment-meta d-flex align-items-center"></div>
        <span className="comment-date d-flex align-items-center">
          <div className="icon-container d-flex align-items-center">
            <Skeleton circle width={30} height={30} />
          </div>
          <Skeleton width={150} />
        </span>
        <div className="comment-content">
          <Skeleton count={4} />
        </div>
      </div>
    </Col>
  );
};

export default SkeletonCommentsTab;
