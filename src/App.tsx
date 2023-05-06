import "bootswatch/dist/pulse/bootstrap.min.css";
import PlayersEditor from "./PlayersEditor";
import { useEffect, useState } from "react";
import { Player, Rotation, RotationStatus } from "./types";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import RotationListDisplay from "./RotationListDisplay";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [numberOfRotations, setNumberOfRotations] = useState<number>(8);
  const [numberOfPlayersInRotation, setNumberOfPlayersInRotation] =
    useState<number>(4);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const rotationsFromLocalStorage = localStorage.getItem("rotations");
    if (rotationsFromLocalStorage) {
      setRotations(JSON.parse(rotationsFromLocalStorage));
    }
    const playersFromLocalStorage = localStorage.getItem("players");
    if (playersFromLocalStorage) {
      setPlayers(JSON.parse(playersFromLocalStorage));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    setRotationsAndSaveToLocalStorage(
      populateRotations(
        rotations,
        players,
        numberOfRotations,
        numberOfPlayersInRotation
      )
    );
  }, [players, numberOfRotations, numberOfPlayersInRotation, isLoaded]);

  function setPlayersAndSaveToLocalStorage(players: Player[]) {
    localStorage.setItem("players", JSON.stringify(players));
    setPlayers(players);
  }

  function setRotationsAndSaveToLocalStorage(rotations: Rotation[]) {
    localStorage.setItem("rotations", JSON.stringify(rotations));
    setRotations(rotations);
  }

  function resetGame() {
    if (!window.confirm("Are you sure you want to reset the game?")) {
      return;
    }

    setPlayersAndSaveToLocalStorage([]);
    setRotationsAndSaveToLocalStorage([]);
  }

  return (
    <Container>
      <Row>
        <Col>
          <Tabs defaultActiveKey="Players">
            <Tab eventKey="Players" title="Players">
              <Container>
                <Row>
                  <Col>
                    <PlayersEditor
                      players={players}
                      setPlayers={setPlayersAndSaveToLocalStorage}
                      getPlannedTotalRotations={(player) =>
                        numberOfRotationsPlayed(player, rotations)
                      }
                    />
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="Rotations" title="Rotations">
              <Container>
                <Row>
                  <Col>
                    <RotationListDisplay
                      rotations={rotations}
                      setRotationStatus={(rotation, status) => {
                        const newRotations = [...rotations];
                        const rotationIndex = newRotations.findIndex(
                          (r) => r.id === rotation.id
                        );
                        newRotations[rotationIndex].status = status;
                        setRotationsAndSaveToLocalStorage(newRotations);
                      }}
                    />
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="Settings" title="Settings">
              <Container>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      value={numberOfRotations}
                      onChange={(event) =>
                        setNumberOfRotations(parseInt(event.target.value))
                      }
                    />
                    <Form.Text>Number of rotations</Form.Text>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      value={numberOfPlayersInRotation}
                      onChange={(event) =>
                        setNumberOfPlayersInRotation(
                          parseInt(event.target.value)
                        )
                      }
                    />
                    <Form.Text>Number of players in each rotation</Form.Text>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="danger" onClick={resetGame}>
                      Reset Game
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

function createNextRotation(
  rotations: Rotation[],
  players: Player[],
  numberOfPlayersInRotation: number
): Rotation {
  const newRotation: Rotation = {
    id: Math.random().toString(),
    status: RotationStatus.NotStarted,
    players: players
      .filter((player) => !player.isIncapacitated)
      .sort((a, b) => {
        const playerARotations = numberOfRotationsPlayed(a, rotations);
        const playerBRotations = numberOfRotationsPlayed(b, rotations);

        if (playerARotations < playerBRotations) {
          return -1;
        }
        if (playerARotations > playerBRotations) {
          return 1;
        }
        if (a.didPartialRotation && !b.didPartialRotation) {
          return -1;
        }
        if (!a.didPartialRotation && b.didPartialRotation) {
          return 1;
        }
        return 0;
      })
      .slice(0, numberOfPlayersInRotation)
      .map((player) => ({
        id: player.id,
        name: player.name,
        rotations: numberOfRotationsPlayed(player, rotations) + 1,
      })),
  };

  return newRotation;
}

function populateRotations(
  rotations: Rotation[],
  players: Player[],
  numberOfRotations: number,
  numberOfPlayersInRotation: number
): Rotation[] {
  const immutableRotations = rotations.filter(
    (rotation) => rotation.status !== RotationStatus.NotStarted
  );
  const numberOfNewRotationsNeeded =
    numberOfRotations - immutableRotations.length;

  const newRotations = [...immutableRotations];
  for (let i = 0; i < numberOfNewRotationsNeeded; i++) {
    newRotations.push(
      createNextRotation(newRotations, players, numberOfPlayersInRotation)
    );
  }

  return newRotations;
}

function numberOfRotationsPlayed(
  player: Player,
  rotations: Rotation[]
): number {
  return (
    player.additionalRotations +
    rotations.filter((rotation) =>
      rotation.players.some((p) => p.id === player.id)
    ).length
  );
}

export default App;
