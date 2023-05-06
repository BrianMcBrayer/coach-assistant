import "bootswatch/dist/pulse/bootstrap.min.css";
import PlayersEditor from "./PlayersEditor";
import { useEffect, useState } from "react";
import { Player, Rotation, RotationStatus } from "./types";
import {
  Button,
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
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
    <Container fluid>
      <Row>
        <Col>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
              <img
                src="/soccer_ball2.svg"
                width={30}
                height={30}
                className="d-inline-block align-top"
                alt="logo"
              />{" "}
              Rotation Tracker
            </Navbar.Brand>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey="Players">
            <Tab eventKey="Players" title="Players">
              <Container fluid>
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
              <Container fluid>
                <Row>
                  <Col>
                    <RotationListDisplay
                      rotations={rotations}
                      canSetRotationStatus={(rotation) =>
                        canUpdateRotationStatus(rotation, rotations)
                      }
                      setRotationStatus={(rotation, status) => {
                        if (
                          !canUpdateRotationStatus(rotation, rotations) ||
                          rotation.status === status
                        ) {
                          return;
                        }

                        const updatedRotations = rotations.map((r) =>
                          r === rotation ? { ...r, status } : r
                        );
                        setRotationsAndSaveToLocalStorage(updatedRotations);
                      }}
                    />
                  </Col>
                </Row>
              </Container>
            </Tab>
            <Tab eventKey="Settings" title="Settings">
              <Container fluid>
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

function canUpdateRotationStatus(
  rotation: Rotation,
  rotations: Rotation[]
): boolean {
  const previousRotations = rotations.slice(0, rotations.indexOf(rotation));
  const subsequentRotations = rotations.slice(rotations.indexOf(rotation) + 1);
  const isPreviousRotationsComplete = previousRotations.every(
    (rotation) => rotation.status === RotationStatus.Complete
  );
  const isSubsequentRotationsInProgressOrComplete = subsequentRotations.some(
    (rotation) =>
      rotation.status === RotationStatus.InProgress ||
      rotation.status === RotationStatus.Complete
  );
  return (
    isPreviousRotationsComplete && !isSubsequentRotationsInProgressOrComplete
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
