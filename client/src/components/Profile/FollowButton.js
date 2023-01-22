import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleUserFollow } from "../../redux/slices/authSlice";
import { FaUserCheck } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";

const FollowButton = ({ passedUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);

  return useMemo(() => {
    if (user && Object.entries(user)?.length > 0) {
      if (user?.username !== passedUser?.username) {
        return (
          <>
            <Button
              onClick={() => dispatch(toggleUserFollow(passedUser?.username))}
              className="d-flex align-items-center"
            >
              {!user?.following?.includes(passedUser?.username) ? (
                <>
                  <IoPersonAdd />
                  follow
                </>
              ) : (
                <>
                  <FaUserCheck />
                  followed
                </>
              )}
            </Button>
          </>
        );
      }
    } else {
      return (
        <Button className="d-flex align-items-center">
          <IoPersonAdd />
          follow
        </Button>
      );
    }
    // eslint-disable-next-line
  }, [user]);
};

export default FollowButton;
