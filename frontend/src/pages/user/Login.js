
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { fetchAuthentication } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../App';




export function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if(token) navigate('/user/dashboard')
  })

  const login = (e) => {
    e.preventDefault();
    const userData = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value
    }

    axios.post('/user/login', userData).then((res) => {
      if (res.data.token) {
        localStorage.setItem('accessToken', res.data.token);
        fetchAuthentication.get('/user').then((res) => {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          console.log('Hello');
          setUser(res.data.user)
        });

      }
    })
  }





  return (

    <Form onSubmit={login}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name="email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name="password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>

  )
}
