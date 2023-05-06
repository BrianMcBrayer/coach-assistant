"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Stack,
} from "react-bootstrap";

interface Player {
  name: string;
  rotations: number;
  hasPartialRotation: boolean;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersOnField, setPlayersOnField] = useState<Player[]>([]);
  const [nextPlayersOnField, setNextPlayersOnField] = useState<Player[]>([]);
  const [numberOfPlayersOnField, setNumberOfPlayersOnField] =
    useState<number>(4);
  const [numberOfPlayersOnFieldInput, setNumberOfPlayersOnFieldInput] =
    useState<number>(numberOfPlayersOnField);

  useEffect(() => {
    setNextPlayersOnField(
      players
        .sort((a, b) => {
          if (a.rotations < b.rotations) {
            return -1;
          } else if (a.rotations > b.rotations) {
            return 1;
          } else {
            if (a.hasPartialRotation && !b.hasPartialRotation) {
              return -1;
            } else if (!a.hasPartialRotation && b.hasPartialRotation) {
              return 1;
            } else {
              return 0;
            }
          }
        })
        .slice(0, numberOfPlayersOnField)
    );
  }, [players, numberOfPlayersOnField]);

  function setPlayersOnFieldAndIncrementRotations(
    nextPlayersOnField: Player[],
    setPlayers: Dispatch<SetStateAction<Player[]>>
  ) {
    const newPlayers = [...players];
    const newPlayersOnField = [...playersOnField];
    nextPlayersOnField.forEach((player) => {
      const index = newPlayers.findIndex((p) => p.name === player.name);
      if (index !== -1) {
        newPlayers[index].rotations++;
        newPlayers[index].hasPartialRotation = false;
        newPlayersOnField.push(newPlayers[index]);
        newPlayers.splice(index, 1);
      }
    });
    setPlayersOnField(newPlayersOnField);
    setPlayers(newPlayers);
  }

  return (
    <Container fluid>
      <Row></Row>
      <Row>
        <Col>
          <h4>Current players on field</h4>
          <ReadOnlyPlayerList players={playersOnField} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Next players on field</h4>
          <ReadOnlyPlayerList players={nextPlayersOnField} />
          <Button variant="secondary" onClick={() => setPlayersOnFieldAndIncrementRotations(nextPlayersOnField, setNextPlayersOnField)}>Rotate</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Players</h4>
          <PlayerList players={players} setPlayers={setPlayers} />
        </Col>
      </Row>
      <Col>
        <h4>Configuration</h4>
        <Stack direction="horizontal" gap={3}>
          <Form.Control
            className="me-auto"
            type="number"
            value={numberOfPlayersOnField}
            onChange={(event) =>
              setNumberOfPlayersOnFieldInput(parseInt(event.target.value, 10))
            }
          />
          <Button
            variant="secondary"
            onClick={() =>
              setNumberOfPlayersOnField(numberOfPlayersOnFieldInput)
            }
          >
            Update Number of Players on Field
          </Button>
        </Stack>
      </Col>
      <Row>
        <Col>Game controls</Col>
      </Row>
    </Container>
  );
}

function ReadOnlyPlayerList(props: { players: Player[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Rotations</th>
          <th>Did Partial Rotation</th>
        </tr>
      </thead>
      <tbody>
        {props.players.map((player, index) => (
          <tr key={index}>
            <td>{player.name}</td>
            <td>{player.rotations}</td>
            <td>{player.hasPartialRotation ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function PlayerList(props: {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
}) {
  const [newPlayerName, setNewPlayerName] = useState<string>("");

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotations</th>
            <th>Did Partial Rotation</th>
          </tr>
        </thead>
        <tbody>
          {props.players.map((player, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={player.name}
                  onChange={(event) => {
                    const newPlayers = [...props.players];
                    newPlayers[index].name = event.target.value;
                    props.setPlayers(newPlayers);
                  }}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={player.rotations}
                  onChange={(event) => {
                    const newPlayers = [...props.players];
                    newPlayers[index].rotations = Number(event.target.value);
                    props.setPlayers(newPlayers);
                  }}
                />
              </td>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={player.hasPartialRotation}
                  onChange={(event) => {
                    const newPlayers = [...props.players];
                    newPlayers[index].hasPartialRotation = event.target.checked;
                    props.setPlayers(newPlayers);
                  }}
                />
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newPlayers = [...props.players];
                    newPlayers.splice(index, 1);
                    props.setPlayers(newPlayers);
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Stack direction="horizontal" gap={3}>
        <Form.Control
          className="me-auto"
          type="text"
          value={newPlayerName}
          onChange={(event) => setNewPlayerName(event.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            props.setPlayers([
              ...props.players,
              { name: newPlayerName, rotations: 0, hasPartialRotation: false },
            ]);
            setNewPlayerName("");
          }}
        >
          Add Player
        </Button>
      </Stack>
    </>
  );
}
