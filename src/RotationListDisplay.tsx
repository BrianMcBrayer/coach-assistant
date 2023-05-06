import { Tab, Tabs } from "react-bootstrap";
import { Rotation, RotationStatus } from "./types";
import RotationDisplay from "./RotationDisplay";

interface Props {
  rotations: Rotation[];
  canSetRotationStatus: (rotation: Rotation) => boolean;
  setRotationStatus: (rotation: Rotation, status: RotationStatus) => void;
}

export default function RotationListDisplay({ rotations, canSetRotationStatus, setRotationStatus }: Props) {
  return (
    <Tabs defaultActiveKey="0" fill>
      {rotations.map((rotation, index) => (
        <Tab eventKey={index.toString()} key={index} title={`${index + 1}`}>
          <RotationDisplay
            rotation={rotation}
            canSetRotationStatus={canSetRotationStatus(rotation)}
            setRotationStatus={(status) => setRotationStatus(rotation, status)}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
