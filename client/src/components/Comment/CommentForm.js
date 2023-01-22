import { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addComment } from "../../redux/slices/commentSlice";
import { useNavigate } from "react-router-dom";

const CommentForm = ({ topic, onSubmitting, passedComment = null }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let isAuth = localStorage.getItem("isLoggedIn") ? true : false;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      navigate("/login");
      return;
    }
    if (!comment || comment?.trim().length === 0) return;
    const id = topic?._id;
    const parentComment = passedComment?._id || null;
    try {
      dispatch(addComment({ id, comment, parentComment }));
      setComment("");
      if (onSubmitting) onSubmitting();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Form className="floating" onSubmit={handleAddComment}>
      <Form.Group className="form-group" as={Col} controlId="topicTitle">
        <Form.Control
          as="textarea"
          rows={3}
          type="text"
          name="comment"
          value={comment}
          placeholder="Enter comment here..."
          onChange={(e) => setComment(e.target.value)}
        />
        <Form.Label>Your reply goes here...</Form.Label>
      </Form.Group>
      <Button type="submit" className="float-end">
        Post Comment
      </Button>
    </Form>
  );
};

export default CommentForm;
