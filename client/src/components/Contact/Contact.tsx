import { memo } from "react";
import { Container } from 'react-bootstrap';

type ContactProps = {}

function Contact (props: ContactProps) {
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