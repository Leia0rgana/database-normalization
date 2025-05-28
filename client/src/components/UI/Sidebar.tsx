import { TableList } from '../TableList';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { TableSchema as TableSchemaType } from '../../utils/types';
import React from 'react';

type Props = {
  isTableFormShown: boolean;
  isDependenciesFormShown: boolean;
  onTableFormShow: () => void;
  onDependenciesFormShow: () => void;
  selectedTable: TableSchemaType | null;
  setSelectedTable: (table: TableSchemaType) => void;
};

export const Sidebar = (props: Props) => {
  const {
    isTableFormShown,
    isDependenciesFormShown,
    onTableFormShow,
    onDependenciesFormShow,
    selectedTable,
    setSelectedTable,
  } = props;

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <>
      <MdOutlineKeyboardDoubleArrowRight
        className={`${isSidebarOpen ? 'rotate-180 right-0' : 'left-2'} ${
          isTableFormShown || isDependenciesFormShown ? 'hidden' : ''
        } absolute top-4 z-99999 sm:hidden w-7 h-7 cursor-pointer`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`${
          isSidebarOpen ? 'flex' : 'hidden'
        }  absolute z-50000 sm:static sm:z-0 sm:flex flex-col w-full sm:w-64 lg:w-[250px] p-4 border-r bg-gray-50 border-gray-200 transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-xl text-[#252b35] font-semibold mb-4">Отношения</h2>
        <div className="flex-1 overflow-y-auto min-h-[50vh]">
          <TableList
            onTableSelect={setSelectedTable}
            selectedTable={selectedTable?.name}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={onTableFormShow}
          >
            Добавить отношение
          </button>
          <button
            className=" bg-green-500 leading-5 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={onDependenciesFormShow}
          >
            Добавить функциональные зависимости
          </button>
        </div>
      </div>
    </>
  );
};
