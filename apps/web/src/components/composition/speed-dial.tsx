import { Expand, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface SpeedDialAction {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
}

const SpeedDial: React.FC<SpeedDialProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isOpen && (
        <div
          className="z-20 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={toggleOpen}
        ></div>
      )}

      <div className="fixed bottom-4 right-4 z-20">
        <div className="relative">
          <ul
            className={`absolute bottom-[4.5rem] right-1 flex flex-col-reverse items-center space-y-reverse space-y-4 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } transition-opacity duration-300`}
          >
            {actions.map((action, index) => (
              <li
                key={index}
                className={`flex items-center transform transition-transform duration-300 ease-out ${
                  isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-0'
                } delay-[${index * 100}ms]`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="bg-white text-gray-700 py-1 px-2 rounded shadow-md text-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}">
                  {action.name}
                </span>
                <button
                  onClick={() => {
                    action.onClick();
                    toggleOpen();
                  }}
                  className="flex items-center ml-3 justify-center w-12 h-12 rounded-full shadow-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none transform transition-transform hover:scale-110"
                  aria-label={action.name}
                >
                  {action.icon}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={toggleOpen}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transform transition-transform hover:scale-110"
            aria-label="Open Speed Dial"
          >
            {isOpen ? (
              <Expand className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeedDial;
