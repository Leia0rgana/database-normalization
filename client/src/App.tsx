import React from 'react';
import './App.css';
import { TableSchema } from './components/table-schema';
import { useAppDispatch } from './redux/hooks';
import { clearSchema } from './redux/slices/tableSchemaSlice';
import { TableList } from './components/table-list';

function App() {
  const [isFormShown, setIsFormShown] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleCancelClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(clearSchema());
    setIsFormShown(false);
  };
  return (
    <div className="flex justify-evenly">
      <div className="font-medium! text-base text-[#4a5568]">
        Добавить таблицу{' '}
        <button className="addButton" onClick={() => setIsFormShown(true)}>
          +
        </button>
        {isFormShown && <TableSchema handleCancelClick={handleCancelClick} />}
      </div>
      <TableList />
    </div>
  );
}

export default App;
