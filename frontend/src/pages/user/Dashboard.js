import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import Themes from "../../components/Themes";
import { Button } from "react-bootstrap";
import { getUser } from "../../services/AuthService";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [countOfCards, setCountOfCards] = useState(0);

  function getCardsOfUser(user) {
    let cards = 0;

    user.themes.forEach(theme => {
      cards += theme.cards.length
    });

    return cards;
  }

  useEffect(() => {
    getUser(setUser);
    if (!user) {
      navigate('/user'); // Ha a felhasználó nincs bejelentkezve, elnavigál a /user oldalra
      return;
    }
    const cardsCount = getCardsOfUser(user); // Kártyaszám kiszámítása
    setCountOfCards(cardsCount); // Kártyaszám állapotának frissítése

  }, [user, navigate, setUser]); // Az useEffect futtatása mindig a user vagy a navigate változó változása esetén
  return user ? (
    <div>
      {user.cardsForRepeat.length !== 0 ?
        <Link to={'/user/cards'}>
          <Button>{user.cardsForRepeat.length} darab kártyád van ismétlésre</Button>
        </Link>
        :
        'Nincs kártyád ismétlésre'}
      <h1>Üdvözöllek, {user.name}</h1>
      <h1>Jelenleg {user.themes.length} darab témád van és {countOfCards} kártyád van összesen</h1>
      <Themes themes={user.themes} />
    </div>
  ) : null; // Csak akkor jeleníti meg a Dashboardot, ha a felhasználó be van jelentkezve
}
