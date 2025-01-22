import React from 'react';
import './App.css';
import { TableSchema } from './components/table-schema';

function App() {
  const [isFormShown, setIsFormShown] = React.useState<boolean>(false);

  return (
    <>
      Добавить таблицу <button onClick={() => setIsFormShown(true)}>+</button>
      {isFormShown && <TableSchema />}
    </>
  );
}

export default App;
