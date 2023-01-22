import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopicComments } from "../../redux/slices/commentSlice";
import CommentItem from "./CommentItem";
import SkeletonComments from "../Skeletons/SkeletonComments";

const CommentsContainer = ({ topic }) => {
  const { comments, getTopicCommentsState } = useSelector(
    (state) => state.comment
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (topic?._id) {
      const id = topic?._id;
      dispatch(getTopicComments(id));
    }
  }, [dispatch, topic?._id]);

  return (
    <div className="comments-container">
      <div className="answers d-flex align-items-center">
        <span className="stats d-flex align-items-center">
          {comments?.length > 0 ? comments?.length : "0"} Answers
        </span>
      </div>
      {getTopicCommentsState?.isLoading && (
        <>
          <SkeletonComments />
          <SkeletonComments />
        </>
      )}
      {!getTopicCommentsState?.isLoading && comments?.length > 0 && (
        <CommentItem comments={comments} parentComment={null} topic={topic} />
      )}
    </div>
  );
};

export default CommentsContainer;
