import { Nav, Image } from "react-bootstrap";
import { GiPlayButton } from "react-icons/gi";
import { RiCheckFill } from "react-icons/ri";
import { MdReply, MdDelete } from "react-icons/md";
import MaskAvatar from "./MaskAvatar";
import { BsClockFill } from "react-icons/bs";
import moment from "moment";
import CommentForm from "./CommentForm";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleUpvoteComment,
  toggleDownvoteComment,
  deleteComment,
} from "../../redux/slices/commentSlice";
import { useNavigate } from "react-router-dom";

const CommentItem = (props) => {
  const [isOpen, setIsOpen] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toVote, setToVote] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("user"))?.username;
  const avatar = JSON.parse(localStorage.getItem("user"))?.avatar?.url;
  const isAuth = localStorage.getItem("isLoggedIn") ? true : false;
  const { votingIsLoading, deleteCommentLoading } = useSelector(
    (state) => state.comment
  );

  const handleToggleUpvoteComment = (id) => {
    setToVote(id);
    dispatch(toggleUpvoteComment(id));
  };

  const handleToggleDownvoteComment = (id) => {
    setToVote(id);
    dispatch(toggleDownvoteComment(id));
  };

  const comments = props?.comments?.filter(
    (c) => props?.parentComment === c?.parentComment
  );

  return (
    <>
      {comments?.map((comment) => {
        const replies = props?.comments?.filter(
          (c) => c?.parentComment === comment?._id
        );

        return (
          <div key={comment?._id} className="thread-container">
            {deleteCommentLoading && toDelete === comment?._id && (
              <div className="loader"></div>
            )}
            <div className="comment d-flex">
              <div className="commenter-avatar">
                <Image src={comment?.author?.avatar?.url} />
                <MaskAvatar />
                <RiCheckFill className="check-mark" />
              </div>
              <div className="comment-info">
                <div className="comment-meta d-flex align-items-center">
                  <h5 className="comment-writer">
                    {`${comment?.author?.firstName} ${comment?.author?.lastName}`}
                  </h5>
                  <span className="comment-badge">best answer</span>
                  <span className="comment-date d-flex align-items-center">
                    <BsClockFill />
                    {moment
                      .utc(comment?.createdAt)
                      .local()
                      .startOf("seconds")
                      .fromNow()}
                    .
                  </span>
                </div>
                <p className="comment-content">{comment?.content}</p>
                <Nav className="comment-actions">
                  <Nav.Link
                    disabled={votingIsLoading && toVote === comment?._id}
                    onClick={() => {
                      if (!isAuth) navigate("/login");
                      if (isAuth) handleToggleUpvoteComment(comment?._id);
                    }}
                    className={`d-flex align-items-center upvote ${
                      username && comment?.upvotes.includes(username)
                        ? "pressed"
                        : ""
                    }`}
                  >
                    <GiPlayButton />
                    upvote ({comment?.upvotes?.length})
                  </Nav.Link>
                  <Nav.Link
                    disabled={votingIsLoading && toVote === comment?._id}
                    onClick={() => {
                      if (!isAuth) navigate("/login");
                      if (isAuth) handleToggleDownvoteComment(comment?._id);
                    }}
                    className={`d-flex align-items-center downvote ${
                      username && comment?.downvotes?.includes(username)
                        ? "pressed"
                        : ""
                    }`}
                  >
                    <GiPlayButton />
                    downvote ({comment?.downvotes?.length})
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      if (isOpen === comment?._id) {
                        setIsOpen(null);
                      } else {
                        setIsOpen(null);
                        setIsOpen(comment?._id);
                      }
                    }}
                    className="d-flex align-items-center"
                  >
                    <MdReply />
                    reply
                  </Nav.Link>
                  {username && comment?.author?.username === username && (
                    <Nav.Link
                      disabled={deleteCommentLoading}
                      onClick={() => {
                        if (!isAuth) {
                          navigate("/login");
                          return;
                        }
                        if (isAuth) {
                          setToDelete(comment?._id);
                          dispatch(deleteComment(comment?._id));
                        }
                      }}
                      className="d-flex align-items-center"
                    >
                      <MdDelete />
                      Delete
                    </Nav.Link>
                  )}
                </Nav>
              </div>
            </div>
            <div className="replies-container">
              {isOpen && isOpen === comment?._id && (
                <div className="comment d-flex">
                  <div className="commenter-avatar">
                    <Image src={avatar} />
                    <MaskAvatar />
                    <RiCheckFill className="check-mark" />
                  </div>
                  <div className="comment-info">
                    <CommentForm
                      onSubmitting={() => setIsOpen(null)}
                      passedComment={comment}
                      topic={props?.topic}
                    />
                  </div>
                </div>
              )}
              {replies?.length > 0 && (
                <CommentItem
                  comments={props?.comments}
                  parentComment={comment?._id}
                  topic={props?.topic}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CommentItem;
