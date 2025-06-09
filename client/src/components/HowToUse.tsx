import { STEPS } from '../utils/constants';

type Props = {
  id: string;
};

export const HowToUse = (props: Props) => {
  return (
    <section id={props.id} className="pb-30">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#252b35]">
        Как использовать DBNormalizer
      </h2>
      <h3 className="text-xl text-gray-600 text-center mb-8">4 шага к 3НФ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 max-w-5xl mx-auto">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 pt-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100 min-h-[260px] group"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-3xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <small className="absolute top-3 left-3 text-xs text-gray-400 font-bold">
              {index + 1}
            </small>
            <h4 className="font-semibold text-lg mb-2 text-[#1A80E5] text-center mt-6">
              {step.title}
            </h4>
            <p className="text-gray-600 text-center text-base">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
