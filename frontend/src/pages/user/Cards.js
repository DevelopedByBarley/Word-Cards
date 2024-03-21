import { Button, ButtonGroup, Table } from "react-bootstrap";

export default function Cards({ theme, deleteCard }) {
  return (
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

        {theme.cards
          ?.filter(card => card.state < 6) // Szűrés aktív kártyákra
          .map((card, index) => (
            <tr key={card._id}>
              <td>{index + 1}</td>
              <td>{card.word}</td>
              <td>{card.state}</td>
              <td>
                { !card.repeat ?
                  new Date(card.expires).toLocaleDateString() :
                  <span className="d-inline-block bg-success text-light p-2 rounded mt-1x0x00#">Ismétlésre aktív</span>
                }
              </td>
              <td>
                <ButtonGroup>
                  <Button className="m-1" variant="warning">Frissít</Button>
                  <Button className="m-1" variant="danger" onClick={() => deleteCard(card._id)}>Töröl</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))
        }


      </tbody>
    </Table>
  )
}
