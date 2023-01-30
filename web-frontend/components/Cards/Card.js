import React from "react";

export default function Card({children, className = '', title = '', subtitle = '', props = null, right = null}) {
  return (
    <div className={`bg-white overflow-hidden flex flex-col rounded-lg p-4 text-sm ${className}`} {...props}>
      {title || subtitle || right ? (
        <div className="flex flex-row justify-between mb-2">
          <div className="flex flex-col">
            <span className="font-semibold text-xl my-auto">{title}</span>
            <span className="text-gray-chateau-500">{subtitle}</span>
          </div>
          <div>
            {right}
          </div>
        </div>
      ) : ''}
      {children}
    </div>
  )
}