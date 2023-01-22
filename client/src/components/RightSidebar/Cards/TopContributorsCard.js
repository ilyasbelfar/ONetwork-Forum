import { useEffect, useMemo } from "react";
import { Nav, Image } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { RiBallPenFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getTopContributors } from "../../../redux/slices/topicSlice";
import { Link } from "react-router-dom";
import SkeletonCard from "../../Skeletons/SkeletonCard";

const TopContributorsCard = () => {
  const { topContributors, topContributorsIsLoading } = useSelector(
    (state) => state.topic
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTopContributors());
  }, [dispatch]);
  return useMemo(() => {
    return (
      <Nav className="top flex-column">
        <Nav.Item>
          <div className="d-flex align-items-center">
            <FaUserEdit />
            top contributors
          </div>
          <p className="nav-description">people who started the most topics.</p>
        </Nav.Item>
        {topContributorsIsLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!topContributorsIsLoading &&
          topContributors?.length > 0 &&
          topContributors?.map((user, idx) => (
            <Link
              key={idx}
              className="nav-link d-flex align-items-center"
              to={`/user/${user?._id}`}
            >
              <Image src={user?.author?.avatar?.url} />
              <h5 className="user">
                {user?.author?.firstName} {user?.author?.lastName}
              </h5>
              <span className="user-stats d-flex align-items-center">
                <RiBallPenFill />
                {user?.count}
              </span>
            </Link>
          ))}
      </Nav>
    );
  }, [topContributors, topContributorsIsLoading]);
};

export default TopContributorsCard;
