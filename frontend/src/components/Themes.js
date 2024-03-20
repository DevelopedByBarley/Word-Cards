import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Themes({ themes }) {

  return (
    <div>
      {themes.map(theme => (
        <Link to={`/user/theme/${theme._id}`}>
          <Card
            style={{ width: '18rem', backgroundColor: theme.color }}
            className="text-light"
          >
            <Card.Header>Téma</Card.Header>
            <Card.Body>
              <Card.Title>{theme.name}</Card.Title>
              <Card.Text>
                Ez a téma jelenleg {theme.cards.length} kártyát tartalmaz.
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      ))}
    </div>
  );
}
