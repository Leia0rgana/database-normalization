import { useNavigate } from 'react-router';
import { useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/userSlice';

export const Home = () => {
  const userDataSelector = useAppSelector(selectUser);
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (userDataSelector?.name !== '') {
      navigate('/normalization');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex  flex-col md:flex-row justify-around items-center md:mt-18">
      <div className="flex flex-col items-start gap-2 py-5 px-5 text-center md:text-left md:gap-4 md:px-0 md:pl-5">
        <h1 className="font-medium text-3xl text-[#252b35]">
          Приведите свою базу данных в порядок
        </h1>
        <p className="text-[#252b35]">
          DBNormilizer поможет легко нормализовать структуру базы данных
          <br />и обеспечить целостность данных без сложных теорий
        </p>
        <button
          className="bg-[#1A80E5] hover:bg-[#5ba3eb] text-white font-semibold p-[10px] rounded-xl active:outline-2 active:outline-blue-400/50 transition duration-400 ease-in-out mt-3 w-[20%] min-w-25 self-center md:self-start"
          onClick={handleStartClick}
        >
          Начать
        </button>
      </div>
      <img
        src="/images/main.svg"
        alt="tables in database"
        decoding="async"
        className="hue-rotate-16 w-full max-w-lg md:max-w-md lg:max-w-xl object-contain"
      />
    </div>
  );
};
