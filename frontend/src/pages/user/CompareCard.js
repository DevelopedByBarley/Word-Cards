import { useContext, useEffect, useState } from "react"
import { AlertContext, UserContext } from "../../App"
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, ListGroup, Row, Form } from "react-bootstrap";
import { fetchAuthentication } from "../../services/AuthService";

export default function CompareCard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const [cardsForRepeat, setCardsOfRepeat] = useState([]);
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
      .then(res => {
        if (currentCardIndex >= cardsForRepeat.length - 1) {
          setAlert({
            show: true,
            variant: 'success',
            message: 'Kártya eltalálva!'
          });
          navigate('/user/dashboard')
        } else {
          setAlert({
            show: true,
            variant: 'success',
            message: 'Kártya eltalálva!'
          });
          setCurrentCardIndex(prev => prev + 1);
          e.target.elements.translate.value = '';
        }
      })
      .catch(err => {
        if (err.response.data.status === false) {
          e.target.elements.translate.value = '';
  
          if (currentCardIndex >= cardsForRepeat.length - 1) {
            setAlert({
              show: true,
              variant: 'danger',
              message: 'Kártya sajnos nincs eltalálva, majd legközelebb!'
            });
            navigate('/user/dashboard')
          } else {
            setAlert({
              show: true,
              variant: 'danger',
              message: 'Kártya sajnos nincs eltalálva, majd legközelebb!'
            });
            setCurrentCardIndex(prev => prev + 1);
          }
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
            <Card.Body>
              <Card.Title>{cardsForRepeat[currentCardIndex]?.sentence}</Card.Title>
              <Card.Text>
                <Form onSubmit={compare}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Szó beírása" name="translate" required />
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
