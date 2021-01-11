import { memo } from "react";
import { Container } from 'react-bootstrap';

function Contact (props: any) {
  return (
    <Container>
      <br/>
      <br/>
      <h1>The Contact Us Page</h1>
      <div>Add Images, text, and compatible HTML content</div> 
    </Container>
  );
}

export default memo(Contact);