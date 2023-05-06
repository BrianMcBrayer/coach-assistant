// component that is a bootstrap tabbed list of Rotation components that is passed in as props

import { Tab, Tabs } from "react-bootstrap";
import { Rotation, RotationStatus } from "./types";
import RotationDisplay from "./RotationDisplay";

interface Props {
  rotations: Rotation[];
  setRotationStatus: (rotation: Rotation, status: RotationStatus) => void;
}

export default function RotationListDisplay({ rotations, setRotationStatus }: Props) {
  return (
    <div>
      <Tabs defaultActiveKey="0" id="uncontrolled-tab-example">
        {rotations.map((rotation, index) => (
          <Tab eventKey={index.toString()} key={index} title={`${index + 1}`}>
            <RotationDisplay rotation={rotation} setRotationStatus={(status) => setRotationStatus(rotation, status)} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
