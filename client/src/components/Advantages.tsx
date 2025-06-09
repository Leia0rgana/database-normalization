import { ADVANTAGES } from '../utils/constants';

type Props = {
  id: string;
};

export const Advantages = (props: Props) => {
  return (
    <section id={props.id} className="pt-25">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#252b35]">
        Преимущества автоматизированной нормализации
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
        {ADVANTAGES.map((adv, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center min-h-[160px] bg-white rounded-2xl shadow-lg p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100"
          >
            <span className="text-4xl mb-3 select-none">{adv.icon}</span>
            <h3 className="font-semibold text-lg mb-1 text-[#1A80E5] text-center">
              {adv.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};
