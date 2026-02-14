import React, { useState } from 'react';
const FAQ = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Data is now an array of questions { id, question, answer }
  // OR the old object { title, subtitle, questions: [] }
  const questions = Array.isArray(data) ? data : (data?.questions || []);
  const title = (Array.isArray(data) || !data?.title) ? 'الأسئلة الشائعة' : data.title;
  const subtitle = (Array.isArray(data) || !data?.subtitle) ? 'إجابات على كل ما يدور في ذهنك' : data.subtitle;

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (questions.length === 0) return null;

  return (
    <section className="py-24 bg-white relative" id="faq">
      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* 1. Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-heading-brown mb-6 leading-tight">
            {title}
            <span className="block w-20 h-1.5 bg-gold-cta mx-auto mt-4 rounded-full shadow-sm"></span>
          </h2>
          <p className="text-xl text-body-text/80 font-medium">
            {subtitle}
          </p>
        </div>

        {/* 2. Accordion */}
        <div className="space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id || index}
                className={`
                            bg-white rounded-[18px] overflow-hidden border transition-all duration-300
                            ${isOpen ? 'border-gold-cta shadow-md' : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'}
                        `}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-right focus:outline-none group"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-heading-brown group-hover:text-primary'}`}>
                    {item.question}
                  </span>

                  <span className={`
                                flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 transition-all duration-300
                                ${isOpen ? 'bg-gold-cta border-gold-cta text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:border-gold-cta group-hover:text-gold-cta'}
                            `}>
                    <span className="material-symbols-outlined text-xl">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </span>
                </button>

                <div
                  className={`
                                overflow-hidden transition-all duration-500 ease-in-out
                                ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                            `}
                >
                  <div className="p-6 md:p-8 pt-0 text-body-text/80 font-medium leading-relaxed border-t border-gray-100/50">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
