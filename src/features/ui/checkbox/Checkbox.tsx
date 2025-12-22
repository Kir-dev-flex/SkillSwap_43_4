import React, { useEffect, useRef } from 'react';
import style from './checkbox.module.css';

type State = 'empty' | 'remove' | 'done';

interface Props {
  state: State;
  onChange: (state: State) => void;
  label?: string;
  id?: string;
}

function Checkbox({ state, onChange, label = '', id = 'checkbox' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (state === 'empty') onChange('remove');
    else if (state === 'remove') onChange('done');
    else onChange('empty');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === 'empty';
    }
  }, [state]);

  return (
    <label className={style.wrapper} htmlFor={id}>
      <input
        type='checkbox'
        id={id}
        ref={inputRef}
        className={`${style.checkbox} ${style[state]}`}
        onClick={handleClick}
        checked={state === 'done'}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

export default Checkbox;
