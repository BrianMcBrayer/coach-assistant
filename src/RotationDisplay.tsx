import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import { Rotation, RotationStatus } from "./types";

interface Props {
  rotation: Rotation;
  setRotationStatus: (status: RotationStatus) => void;
}

export default function RotationDisplay({
  rotation,
  setRotationStatus,
}: Props) {
  return (
    <>
      {rotation.status === RotationStatus.NotStarted && (
        <Alert variant="info">
          Rotation has not started{" "}
          <Button onClick={() => setRotationStatus(RotationStatus.InProgress)}>
            Start Rotation
          </Button>
        </Alert>
      )}
      {rotation.status === RotationStatus.InProgress && (
        <Alert variant="success">
          Rotation is in progress{" "}
          <Button onClick={() => setRotationStatus(RotationStatus.Complete)}>
            Complete Rotation
          </Button>
        </Alert>
      )}
      {rotation.status === RotationStatus.Complete && (
        <Alert variant="secondary">
          Rotation is complete{" "}
          <Button onClick={() => setRotationStatus(RotationStatus.NotStarted)}>
            Reset Rotation
          </Button>
        </Alert>
      )}
      <Table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Rotations</th>
          </tr>
        </thead>
        <tbody>
          {rotation.players.map((player) => {
            return (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.rotations}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
