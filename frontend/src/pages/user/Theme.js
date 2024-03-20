import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { fetchAuthentication } from "../../services/AuthService";

export default function Theme() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [theme, setTheme] = useState(false);
  const navigate = useNavigate();

  function deleteCard(card_id) {

    fetchAuthentication.delete(`/cards/${card_id}`)
      .then(res => {
        const cardId = res.data.cardId;
        console.log(cardId);

        // Másoljuk a felhasználó állapotát
        const updatedUser = { ...user };

        // Keresés a temák között
        const themeIndex = updatedUser.themes.findIndex(theme => theme._id === id);
        if (themeIndex !== -1) {
          // Keresés a kártyák között
          const cardIndex = updatedUser.themes[themeIndex].cards.findIndex(card => card._id === cardId);
          if (cardIndex !== -1) {
            // Ha megtaláltuk a kártyát, akkor töröljük azt a temából
            updatedUser.themes[themeIndex].cards.splice(cardIndex, 1);

            // Frissítsük a felhasználó állapotát az új kártyával
            setUser(updatedUser);
          }
        }
      })
      .catch(error => {
        // Hibakezelés
        console.error("Hiba történt a kártya törlése közben:", error);
      });
  }



  useEffect(() => {
    if (!user) {
      navigate('/user'); // Ha a felhasználó nincs bejelentkezve, elnavigál a /user oldalra
      return;
    }

    const finded = user.themes.find(theme => theme._id === id);
    console.log(finded);
    if (!finded) navigate('/user/dashboard');
    setTheme(finded);

  }, [navigate, user, id])


  return (
    <div className="mt-5">
      <h1 className="my-5">
        <span className="bg-info text-light rounder p-2 mx-2">{theme.name}</span>
        {user.currentCapacity !== 0 ? (<span>
          <Link to={`/user/theme/${theme._id}/cards/new`}>
            <Button variant="outline-dark">Új kártya</Button>
          </Link>
        </span>): "Elérted a napi limitet"}
        
      </h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Szó</th>
            <th>Státusz</th>
            <th>Lejárat</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>

          {theme.cards?.map((card, index) => (
            <tr>
              <td>{index += 1}</td>
              <td>{card.word}</td>
              <td>{card.state}</td>
              <td>{new Date(card.expires).toLocaleDateString()}</td>
              <td>
                <ButtonGroup>
                  <Button className="m-1" variant="warning">Frissít</Button>
                  <Button className="m-1" variant="danger" onClick={() => deleteCard(card._id)}>Töröl</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}

        </tbody>
      </Table>
    </div>

  )
}
