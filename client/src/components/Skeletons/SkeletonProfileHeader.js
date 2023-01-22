import Skeleton from "react-loading-skeleton";

const SkeletonProfileHeader = () => {
  return (
    <div className="profile-header">
      <div className="user-profile-meta d-flex align-items-center">
        <Skeleton width={153} height={153} />
        <div className="user-info d-flex flex-column">
          <h4 className="user-name">
            <Skeleton width={`25%`} />
          </h4>
          <div className="user-bio">
            <Skeleton width={`50%`} />
          </div>
          <div className="d-flex user-meta">
            <span className="user-id">
              <Skeleton width={60} />
            </span>
            <span className="username">
              <Skeleton width={80} />
            </span>
            <span className="user-website">
              <Skeleton width={120} />
            </span>
          </div>
          <div className="user-actions">
            <Skeleton width={120} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfileHeader;
