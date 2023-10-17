//-----------React-----------//
import React, { useState } from "react";

//-----------Images-----------//
import Happy from "../../Images/LogosIcons/emo-happy.png";
import Sad from "../../Images/LogosIcons/emo-sad.png";
import Angry from "../../Images/LogosIcons/emo-angry.png";
import Confused from "../../Images/LogosIcons/emo-confused.png";
import Sick from "../../Images/LogosIcons/emo-sick.png";
import Yuck from "../../Images/LogosIcons/emo-yuck.png";

export default function JournalForm({ selectedEmotion, onSelect }) {
  // state for emotions
  const [selectedEmo, setSelectedEmo] = useState(Happy);
  const Emotions = [Happy, Sad, Angry, Confused, Sick, Yuck];

  // Function to handle emotion selection
  const handleEmotionSelect = (emotion) => {
    setSelectedEmo(emotion);
    onSelect(emotion);
  };

  return (
    <div className="dropdown dropdown-hover left-[-10px]">
      <label tabIndex={0} className="btn border-0">
        <img src={selectedEmo} alt="selected-emotion" className="w-[3em]" />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box left-[50px] top-[-10px] z-[1] flex w-full flex-row bg-base-100 shadow"
      >
        {Emotions.map((emotion, index) => (
          <li key={index} onClick={() => handleEmotionSelect(emotion)}>
            <img src={emotion} alt={`emotion-${index}`} className="w-[5em]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
