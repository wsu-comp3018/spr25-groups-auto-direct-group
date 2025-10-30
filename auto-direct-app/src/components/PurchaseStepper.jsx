import { Check } from "lucide-react";

const PurchaseStepper = ({ currentStep, steps, className = "" }) => {
  return (
    <div className={`w-64 p-6 bg-white border-r border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Purchase Progress</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <div key={stepNumber} className="flex items-start space-x-3">
              {/* Step Circle/Icon */}
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{stepNumber}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">{stepNumber}</span>
                  </div>
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-grow min-w-0">
                <h4 className={`text-sm font-medium ${
                  isCompleted 
                    ? 'text-black' 
                    : isCurrent 
                    ? 'text-blue-700' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </h4>
                
                <p className={`text-xs mt-1 ${
                  isCompleted 
                    ? 'text-gray-700' 
                    : isCurrent 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
                
                {/* Status indicator */}
                {isCompleted && (
                  <span className="inline-block mt-1 text-xs text-black font-medium">
                    Completed
                  </span>
                )}
                {isCurrent && (
                  <span className="inline-block mt-1 text-xs text-blue-600 font-medium">
                    Current Step
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseStepper;