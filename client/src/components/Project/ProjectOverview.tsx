import { memo } from "react";
import { Container } from 'react-bootstrap';

type ProjectOverviewProps = {}

function ProjectOverview (props: ProjectOverviewProps) {

  return (
    <Container>
      <br/>
      <br/>
      <h1>The Project Overview Page</h1>
      <div>Add Images, text, and compatible HTML content</div> 
    </Container>
  );

}

export default memo(ProjectOverview);