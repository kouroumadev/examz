import {
  Divider,
} from '@chakra-ui/react'
export function Stepper({ step, currentStep }) {
  return (
    <div className="flex md:gap-24 gap-12 m-auto ">
      {step.map((item, index) => (
        <div key={index}>
          <div className="flex text-sm">
            <div className={` ${index < currentStep ? 'bg-blue-1 text-white' : 'border bg-white text-black-5'} px-4 py-3 m-auto rounded-lg `}>
              {index + 1}
            </div>
            {index !== 2 && (
              <div className="bg-red-100">
                <Divider orientation="horizontal" />
              </div>
            )}
          </div>
          <p className="text-blue-1 text-center text-sm mt-2">
            {index < currentStep && item}
          </p>
        </div>
      ))}
    </div>
  )
}
