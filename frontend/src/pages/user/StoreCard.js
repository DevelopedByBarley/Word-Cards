
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { fetchAuthentication } from '../../services/AuthService';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';


export default function StoreCard() {
  const { user, setUser } = useContext(UserContext);
  const { themeId } = useParams();
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate('/user'); // Ha a felhasználó nincs bejelentkezve, elnavigál a /user oldalra
      return;
    }
  }, [navigate, user])


  const store = (e) => {
    e.preventDefault();
  
    const card = {
      word: e.target.elements.word.value.toLowerCase(),
      translate: e.target.elements.translate.value.toLowerCase(),
      sentence: e.target.elements.sentence.value.toLowerCase(),
      user: user._id,
      theme: themeId,
      lang: "En"
    }
  
    // Új kártya mentése a szerverre
    fetchAuthentication.post('/cards', card)
      .then(res => {
        if (res.data.status === true) {
          // Új kártya sikeresen mentve
  
          // Frissítsük a felhasználó állapotát, hogy hozzáadjuk az új kártyát a megfelelő témához
          const prevUser = { ...user }; // Még biztonságosabb, ha lemásoljuk az állapotot
  
          // Keresd meg a felhasználóhoz tartozó témát
          const themeIndex = prevUser.themes.findIndex(theme => theme._id === themeId);
          if (themeIndex !== -1) {
            // Ha megtaláltuk a megfelelő témát, adjuk hozzá az új kártyát a cards tömbhöz
            prevUser.themes[themeIndex].cards.push(res.data.card); // Feltételezzük, hogy az új kártya a 'card' objektum része a válasznak
          }
  
          // Frissítsük a felhasználó állapotát az új változattal
          setUser(prevUser);
  
          // Navigálj az új oldalra
          navigate(`/user/theme/${themeId}`);
        }
      })
      .catch(error => {
        // Kezelés a hiba esetén, pl. hibaüzenet megjelenítése
        console.error("Hiba történt a kártya mentése közben:", error);
      });
  }
  
  


  return (
    <Container className='mt-5'>
      <h1 className='my-5'>Új szó hozzáadása</h1>
      <Form onSubmit={store}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Szó magyarul</Form.Label>
            <Form.Control type="text" placeholder="Szó" name="word" required />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Fordítás angolul/németül</Form.Label>
            <Form.Control type="text" placeholder="Fordítás" name="translate" required />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Példa mondat</Form.Label>
          <Form.Control placeholder="Példa mondat" name='sentence' required />
        </Form.Group>



        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
