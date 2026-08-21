"use client";

import { Check, Pencil } from "lucide-react";

interface CheckoutHeaderProps {
  currentStep: "signup" | "address" | "payment";
}

export default function CheckoutHeader({ currentStep }: CheckoutHeaderProps) {
  const steps = [
    { key: "signup", label: "Signup", number: 1 },
    { key: "address", label: "Address", number: 2 },
    { key: "payment", label: "Payment", number: 3 },
  ] as const;

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-6 lg:px-12">
        {/* Brand */}
        <div className="shrink-0 text-2xl font-black tracking-tight">
          BlackHeadFashion
        </div>

        {/* Progress */}
        <div className="absolute left-1/2 max-w-[calc(100%-180px)] -translate-x-1/2 overflow-x-auto sm:max-w-none">
          <div className="flex min-w-max items-center">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex items-center gap-3 px-4">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isCompleted || isCurrent
                          ? "bg-black text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={14} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Pencil size={12} strokeWidth={2.5} />
                      ) : (
                        <span className="text-xs font-medium">
                          {step.number}
                        </span>
                      )}
                    </div>

                    <span
                      className={`whitespace-nowrap text-sm ${
                        isCompleted || isCurrent
                          ? "font-medium text-black"
                          : "text-neutral-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-px w-16 ${
                        index < currentIndex ? "bg-black" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
