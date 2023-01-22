import Skeleton from "react-loading-skeleton";

const SkeletonTopicPage = () => {
  return (
    <article className="topic-item thread">
      <div className="thread-content">
        <div className="topic-vote d-flex flex-column align-items-center">
          <Skeleton width={20} />
          <span className="votes">
            <Skeleton width={15} />
          </span>
          <Skeleton width={20} />
        </div>
        <div className="topic-item-content">
          <h4 className="topic-title">
            <Skeleton />
          </h4>
          <div className="topic-meta d-flex align-items-center">
            <div className="topic-writer d-flex align-items-center">
              <Skeleton circle width={50} height={50} />
              <h5>
                <Skeleton width={120} />
              </h5>
              <h5>
                <Skeleton width={70} />
              </h5>
            </div>
          </div>
          <p className="topic-summary">
            <Skeleton count={4} />
          </p>
          <div className="tags-container d-flex align-items-center">
            <span className="d-flex align-items-center">
              <Skeleton width={70} />
              <Skeleton width={150} />
              <Skeleton width={150} />
              <Skeleton width={150} />
            </span>
          </div>
          <div className="tags-container d-flex align-items-center">
            <span className="d-flex align-items-center">
              <Skeleton width={150} />
              <Skeleton width={150} />
            </span>
          </div>
        </div>

        <div className="add-comment d-flex pt-5 pr-5 pl-5">
          <Skeleton circle width={50} height={50} />
          <span style={{ height: `100%`, width: `100%`, marginLeft: `1rem` }}>
            <Skeleton height={110} />
          </span>
        </div>
        <div className="comments-container">
          <div className="answers d-flex align-items-center">
            <span className="stats d-flex align-items-center">
              <Skeleton width={100} height={5} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkeletonTopicPage;
