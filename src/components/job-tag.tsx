import React from 'react'

function JobTag({children}: {children?: React.ReactNode}) {
  return (
    <div>
      <span className={`
          text-sm text-primary bg-primary/20 px-2.5 py-1 rounded-xs
          `}>{children}</span>
    </div>
  )
}

export default JobTag