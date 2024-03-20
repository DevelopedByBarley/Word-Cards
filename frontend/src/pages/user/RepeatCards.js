import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, ListGroup, Row, Form } from "react-bootstrap";
import { fetchAuthentication } from "../../services/AuthService";

export default function RepeatCards() {
  const { user } = useContext(UserContext);
  const [cardsForRepeat, setCardsOfRepeat] = useState([]);
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/user'); // Ha a felhasználó nincs bejelentkezve, elnavigál a /user oldalra
      return;
    }
  }, [navigate, user])

  const compare = (e) => {
    e.preventDefault();
    const card = {
      translate: e.target.elements.translate.value,
      cardId: cardsForRepeat[currentCardIndex]._id
    }

    fetchAuthentication.post('/cards/compare', card)
    .then(res => console.log(res.data))
    .catch(err => {
      if(err.response.data.status === false) {
        e.target.elements.translate.value = '';
        setCurrentCardIndex(prev => prev + 1);
        alert('A szó nem helyes.');

      }
    })
  }


  useEffect(() => {
    if (!user) {
      navigate('/user'); // Ha a felhasználó nincs bejelentkezve, elnavigál a /user oldalra
      return;
    }

    setCardsOfRepeat(user.cardsForRepeat)
  }, [navigate, user]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <ListGroup>
            {cardsForRepeat.map((card, index) => (
              <div key={index}>
                <ListGroup.Item className={currentCardIndex === index ? 'text-light bg-primary' : ''}>{card.word}</ListGroup.Item>
              </div>
            ))}

          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col style={{ minHeight: "70vh" }} className="d-flex align-items-center justify-content-center">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>{cardsForRepeat[currentCardIndex]?.sentence}</Card.Title>
              <Card.Text>
                <Form onSubmit={compare}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Szó beírása" name="translate" required/>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>

              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
