import React, { FC, useState } from 'react';
import OptionButton from '../OptionButton';
import { ButtonGroup } from './styles';

interface OptionType {
  label: string;
  value: number;
  disabled?: boolean;
}

interface IOptionButtonGroup {
  options: OptionType[];
  allOption?: boolean;
  allLabel?: string;
  multiple?: boolean;
}

const OptionButtonGroup: FC<IOptionButtonGroup> = ({
  options,
  allOption = false,
  multiple = false,
  allLabel = `All`,
}) => {
  const [selectedAll, setSelectedAll] = useState(true);
  const [value, setValue] = useState([-1]);

  const handleClickAll = () => {
    setSelectedAll(true);
    setValue([-1]);
  };

  const handleClickOption = (val: number) => {
    setSelectedAll(false);
    if (!multiple) {
      setValue([val]);
      return;
    }

    const idx = value.indexOf(val);
    if (idx === -1) {
      setValue([...value, val]);
    } else {
      const temp = [...value];
      temp.splice(idx, 1);
      setValue(temp);
    }
  };

  return (
    <ButtonGroup>
      {allOption && (
        <OptionButton selected={selectedAll} onClick={handleClickAll}>
          {allLabel}
        </OptionButton>
      )}
      {options.map((option) => (
        <OptionButton
          selected={value.indexOf(option.value) !== -1}
          disabled={option?.disabled || false}
          key={option.value}
          onClick={() => handleClickOption(option.value)}
        >
          {option.label}
        </OptionButton>
      ))}
    </ButtonGroup>
  );
};

export default OptionButtonGroup;
