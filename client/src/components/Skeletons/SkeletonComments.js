import Skeleton from "react-loading-skeleton";

const SkeletonComments = () => {
  return (
    <div className="thread-container">
      <div className="comment d-flex">
        <div className="commenter-avatar">
          <Skeleton circle width={50} height={50} />
        </div>
        <div className="comment-info">
          <div className="comment-meta d-flex align-items-center">
            <h5>
              <Skeleton width={120} />
            </h5>
            <span className="comment-date d-flex align-items-center">
              <Skeleton width={70} />
            </span>
          </div>
          <p className="comment-content">
            <Skeleton count={3} />
          </p>
          <div className="d-flex justify-content-around comment-actions">
            <Skeleton width={120} />
            <Skeleton width={120} />
            <Skeleton width={120} />
            <Skeleton width={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonComments;
