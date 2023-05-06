import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { createRef, useState } from "react";
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
  const newPlayerNameRef = createRef<HTMLInputElement>();

  const addPlayer = () => {
    setPlayers([
      ...players,
      {
        name: newPlayerName,
        id: crypto.randomUUID(),
        didPartialRotation: false,
        additionalRotations: 0,
        isIncapacitated: false,
      },
    ]);
    setNewPlayerName("");
    newPlayerNameRef.current?.focus();
  };

  const deletePlayer = (playerIdToDelete: string) => {
    setPlayers(players.filter((player) => player.id !== playerIdToDelete));
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
                <th>Sitting Out</th>
                <th>Rotations</th>
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
                  <td>
                    <Container fluid>
                      <Row>
                        <Col>{getPlannedTotalRotations(player)}</Col>
                        <Col>
                          <Form.Control
                            type="number"
                            value={player.additionalRotations}
                            min={0}
                            onChange={(event) => {
                              const updatedPlayer = {
                                ...player,
                                additionalRotations: parseInt(event.target.value, 10),
                              };
                              updatePlayer(updatedPlayer);
                            }}
                          ></Form.Control>
                          <Form.Text>Additional Rotations</Form.Text>
                        </Col>
                      </Row>
                    </Container>
                  </td>
                  <td>
                    <Button onClick={() => deletePlayer(player.id)}>Delete</Button>
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addPlayer();
              }
            }}
            ref={newPlayerNameRef}
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
