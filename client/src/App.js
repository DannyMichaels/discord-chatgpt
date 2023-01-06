import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

function App() {
  const [message, setMessage] = React.useState(''); // use hook to keep track of the input value
  const [channel, setChannel] = React.useState('1059241282091892846'); // use hook to keep track of the input value

  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh

    axios
      .post('http://localhost:8000/message', { message, channel })
      .then((data) => {
        console.log(`Submission Result: ${data.statusText}`);
      })
      .catch((error) => console.error('Error:', error));
    setMessage('');
  };

  return (
    <InnerColumn>
      <Form onSubmit={handleSubmit}>
        <Label>Message:</Label>
        <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="1059241282091892846">General</option>
          <option value="1059855592795144192">Bot</option>
          <option value="1060814798536843335">Secret</option>
        </Select>
        <Textarea
          value={message}
          onKeyPress={(e) => {
            const shiftKeyPressed = e.shiftKey;
            if (e.key !== 'Enter') return;

            // if key is enter but there is no value
            if (!message) {
              e.preventDefault();
              return;
            }

            // if key is enter and shift isn't pressed submit, else enter a new line
            if (!shiftKeyPressed) {
              handleSubmit(e);
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </InnerColumn>
  );
}

const InnerColumn = styled.main`
  padding: 40px;
  max-width: 1100px;
  margin: 0 auto;

  @media screen and (max-width: 500px) {
    padding: 10px;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  background-color: #fafafa;
`;

const Label = styled.label`
  font-size: 16px;
`;

const Select = styled.select`
  padding: 6px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  font-size: 12px;
`;

const Textarea = styled.textarea`
  font-size: 14px;
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  font-size: 14px;
  background-color: #2f6dd8;
  padding: 10px;
  color: #ffff;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
`;

export default App;
