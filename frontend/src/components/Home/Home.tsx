import { memo } from "react";
import { Container } from 'react-bootstrap';

function Home () {
  return (
    <Container>
      <br/>
      <br/>
      <h1>The Home Page</h1>
      <div>Add Images, text, and compatible HTML content</div> 
    </Container>
  );
}

export default memo(Home);