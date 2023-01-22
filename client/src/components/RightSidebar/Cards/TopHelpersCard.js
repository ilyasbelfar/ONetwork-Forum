import { useEffect, useMemo } from "react";
import { Image, Nav } from "react-bootstrap";
import { BsPersonLinesFill } from "react-icons/bs";
import { SiGooglemessages } from "react-icons/si";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTopHelpers } from "../../../redux/slices/commentSlice";
import SkeletonCard from "../../Skeletons/SkeletonCard";

const TopHelpersCard = () => {
  const { topHelpers, herlpersIsLoading } = useSelector(
    (state) => state.comment
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTopHelpers());
  }, [dispatch]);

  return useMemo(() => {
    return (
      <Nav className="top flex-column">
        <Nav.Item>
          <div className="d-flex align-items-center">
            <BsPersonLinesFill />
            top helpers
          </div>
          <p className="nav-description">people with the most answers.</p>
        </Nav.Item>
        {herlpersIsLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!herlpersIsLoading &&
          topHelpers?.length > 0 &&
          topHelpers?.map((user, idx) => (
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
                <SiGooglemessages />
                {user?.count}
              </span>
            </Link>
          ))}
      </Nav>
    );
  }, [topHelpers, herlpersIsLoading]);
};

export default TopHelpersCard;
