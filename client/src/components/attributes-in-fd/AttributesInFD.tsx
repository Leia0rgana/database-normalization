import React from 'react';
import style from './AttributesInFD.module.css';
import { Attribute } from '../../utils/types';

type AttributesInFDProps = {
  label: string;
  selectedTableAttributes: Array<{ name: string }>;
  selectedAttributes: Attribute[];
  onChangeHandler: (attributes: Attribute[]) => void;
};

export const AttributesInFD = (props: AttributesInFDProps) => {
  const {
    label,
    selectedTableAttributes,
    selectedAttributes,
    onChangeHandler,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const newAttributes = selectedOptions.map((option) => ({
      name: option.value,
    }));
    onChangeHandler(newAttributes);
  };

  return (
    <div className={style.attributeSelector}>
      <label>{label}</label>
      <select
        multiple
        size={3}
        value={selectedAttributes.map((attribute) => attribute.name)}
        onChange={handleChange}
      >
        {selectedTableAttributes.map((attribute) => (
          <option key={attribute.name} value={attribute.name} className="p-1">
            {attribute.name}
          </option>
        ))}
      </select>
      <small>Удерживайте Ctrl для выбора нескольких атрибутов</small>
    </div>
  );
};
