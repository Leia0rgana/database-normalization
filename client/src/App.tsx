import React from 'react';
import './App.css';
import { TableSchema } from './components/table-schema';
import { useAppDispatch } from './redux/hooks';
import { clearSchema } from './redux/slices/tableSchemaSlice';

function App() {
  const [isFormShown, setIsFormShown] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleCancelClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(clearSchema());
    setIsFormShown(false);
  };
  return (
    <>
      Добавить таблицу <button onClick={() => setIsFormShown(true)}>+</button>
      {isFormShown && <TableSchema handleCancelClick={handleCancelClick} />}
    </>
  );
}

export default App;
