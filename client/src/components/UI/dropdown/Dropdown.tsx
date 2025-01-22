import React from 'react';
import style from './Dropdown.module.css';

type Props = {
  list: Array<string>;
};

export const Dropdown = (props: Props) => {
  const { list } = props;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<string>('');

  const handleSelect = (item: string) => {
    if (label === item) {
      setLabel('');
    } else setLabel(item);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={style.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>
      {isOpen && (
        <div className={style.dropdownContainer}>
          <ul className={style.dropdownList}>
            {list.map((item) => (
              <li
                key={item}
                className={`${style.dropdownListItem} ${
                  item === label ? style.selected : ''
                }`}
                onClick={() => handleSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
