import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addTopic, resetNewTopic, getSpaces } from "../redux/slices/topicSlice";

const NewTopic = () => {
  const dispatch = useDispatch();
  const { message, isLoading, isSuccess, isError, newTopicURL } = useSelector(
    (state) => state.topic.addTopic
  );

  const { spaces } = useSelector((state) => state.topic);

  useEffect(() => {
    document.title = `Add New Topic | ONetwork Forum`;
  }, []);

  useEffect(() => {
    dispatch(resetNewTopic());
    dispatch(getSpaces());
  }, [dispatch]);

  var options = [];

  if (spaces && spaces?.length > 0) {
    spaces.forEach((space) => {
      options.push({ value: space.name, label: space.name });
    });
  }

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("Android");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || title?.trim()?.length === 0) return;
    if (!content || content?.trim()?.length === 0) return;
    if (!selectedSpace) return;
    if (!selectedTags || selectedTags.length === 0) return;
    try {
      dispatch(addTopic({ title, content, selectedSpace, selectedTags }));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <main>
      <Container>
        <Row className="new-topic align-items-center justify-content-center">
          <Col lg={8}>
            <section className="new-topic-form">
              {isLoading && <div className="loader"></div>}
              <h5 className="section-title">Add New Topic</h5>
              {message && (
                <div
                  className={`message ${isError ? "error" : ""} ${
                    isSuccess ? "success" : ""
                  } ${isLoading ? "info" : ""}`}
                >
                  {`${message} `}
                  {newTopicURL && (
                    <Link to={newTopicURL}>Click here to preview it.</Link>
                  )}
                </div>
              )}
              <Form className="floating" onSubmit={handleSubmit}>
                <Form.Group
                  className="form-group mb-3"
                  as={Col}
                  controlId="topicTitle"
                >
                  <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    disabled={isLoading}
                    placeholder="Enter topic title..."
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Form.Label>Topic Title</Form.Label>
                </Form.Group>
                <Form.Group
                  className="form-group mb-3"
                  as={Col}
                  controlId="topicDescription"
                >
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    disabled={isLoading}
                    placeholder="Enter topic content..."
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <Form.Label>Topic Content</Form.Label>
                </Form.Group>
                <Form.Group className="form-group select2-container mb-3">
                  <Select
                    classNamePrefix="form-control"
                    placeholder="Choose Topic's Space..."
                    title="space"
                    options={options}
                    isDisabled={isLoading}
                    value={options.filter((obj) => obj.value === selectedSpace)}
                    onChange={(e) => setSelectedSpace(e.value)}
                  />
                  <Form.Label className="control-label">Topic Space</Form.Label>
                </Form.Group>
                <Form.Group className="form-group select2-container mb-3">
                  <CreatableSelect
                    components={{
                      Menu: () => null,
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    placeholder="Enter Topic Tags..."
                    isMulti
                    isDisabled={isLoading}
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(e)}
                  />
                  <Form.Label className="control-label">Topic Tags</Form.Label>
                </Form.Group>
                <Button
                  disabled={isLoading}
                  className="mb-4 w-100"
                  type="submit"
                >
                  {isLoading ? "Adding Topic..." : "Add Topic"}
                </Button>
              </Form>
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default NewTopic;
