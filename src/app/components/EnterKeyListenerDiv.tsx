import React, { KeyboardEvent } from "react";

interface EnterKeyListenerDivProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onEnterClick: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const EnterKeyListenerDiv: React.FC<EnterKeyListenerDivProps> = ({
  onEnterClick,
  ...props
}) => {
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onEnterClick(event);
    }
  };

  return <div {...props} onKeyDown={handleKeyPress} tabIndex={0} />;
};

export default EnterKeyListenerDiv;
