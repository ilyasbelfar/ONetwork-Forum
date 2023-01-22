import { Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const SkeletonFollowTab = () => {
  return (
    <Col lg={12}>
      <div className="follow-brief d-flex align-items-center">
        <Skeleton circle width={80} height={80} />
        <div className="user-meta d-flex flex-column">
          <h5 className="user-name">
            <Skeleton width={200} />
          </h5>
          <span className="username">
            <Skeleton width={150} />
          </span>
          <span className="user-bio">
            <Skeleton width={250} />
          </span>
        </div>
        <Skeleton width={120} height={40} />
      </div>
    </Col>
  );
};

export default SkeletonFollowTab;
