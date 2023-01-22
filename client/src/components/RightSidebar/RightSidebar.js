import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiBallPenFill } from "react-icons/ri";
import TopContributorsCard from "./Cards/TopContributorsCard";
import TopHelpersCard from "./Cards/TopHelpersCard";

const RightSidebar = () => {
  return (
    <Col lg={3} className="right-sidebar">
      <Link className="new-topic mx-auto" to="/topic/new">
        <Button className="d-flex align-items-center">
          <RiBallPenFill />
          Write a New Topic
        </Button>
      </Link>
      <TopContributorsCard />
      <TopHelpersCard />
    </Col>
  );
};

export default RightSidebar;
