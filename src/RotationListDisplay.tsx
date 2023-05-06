import { Tab, Tabs } from "react-bootstrap";
import { Rotation, RotationStatus } from "./types";
import RotationDisplay from "./RotationDisplay";

interface Props {
  rotations: Rotation[];
  setRotationStatus: (rotation: Rotation, status: RotationStatus) => void;
}

export default function RotationListDisplay({ rotations, setRotationStatus }: Props) {
  return (
    <Tabs defaultActiveKey="0" fill>
      {rotations.map((rotation, index) => (
        <Tab eventKey={index.toString()} key={index} title={`${index + 1}`}>
          <RotationDisplay
            rotation={rotation}
            setRotationStatus={(status) => setRotationStatus(rotation, status)}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
