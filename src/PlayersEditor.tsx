import { Button, Col, Form, Row, Stack, Table } from "react-bootstrap";
import { useState } from "react";
import { Player } from "./types";
import { Container } from "react-bootstrap";

interface Props {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  getPlannedTotalRotations: (player: Player) => number;
}

export default function PlayersEditor({
  players,
  setPlayers,
  getPlannedTotalRotations,
}: Props) {
  const [newPlayerName, setNewPlayerName] = useState<string>("");

  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        name: newPlayerName,
        id: Math.random().toString(),
        didPartialRotation: false,
        additionalRotations: 0,
        isIncapacitated: false,
      },
    ]);
    setNewPlayerName("");
  };

  const deletePlayer = (playerToDelete: Player) => {
    setPlayers(players.filter((player) => player.id !== playerToDelete.id));
  };

  const updatePlayer = (playerToUpdate: Player) => {
    setPlayers(
      players.map((player) =>
        player.id === playerToUpdate.id ? playerToUpdate : player
      )
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Additional Rotations</th>
                <th>Sitting Out</th>
                <th>Planned Total Rotations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.name}>
                  <td>
                    <Form.Control
                      type="text"
                      className={player.isIncapacitated ? "text-danger" : ""}
                      value={player.name}
                      onChange={(event) => {
                        const updatedPlayer = {
                          ...player,
                          name: event.target.value,
                        };
                        updatePlayer(updatedPlayer);
                      }}
                    ></Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={player.additionalRotations}
                      min={0}
                      onChange={(event) => {
                        const updatedPlayer = {
                          ...player,
                          rotations: parseInt(event.target.value, 10),
                        };
                        updatePlayer(updatedPlayer);
                      }}
                    ></Form.Control>
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={player.isIncapacitated}
                      onChange={(event) => {
                        const updatedPlayer = {
                          ...player,
                          isIncapacitated: event.target.checked,
                        };
                        updatePlayer(updatedPlayer);
                      }}
                    />
                  </td>
                  <td>{getPlannedTotalRotations(player)}</td>
                  <td>
                    <Button onClick={() => deletePlayer(player)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control
            type="text"
            value={newPlayerName}
            onChange={(event) => setNewPlayerName(event.target.value)}
          />
          <Form.Text>New Player Name</Form.Text>
        </Col>
        <Col>
          <Button onClick={addPlayer}>Add New Player</Button>
        </Col>
      </Row>
    </Container>
  );
}
