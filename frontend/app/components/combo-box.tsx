'use client'
import { JSX, useState } from 'react'

type Props<T extends string & number & undefined> = {
  schema: any
  value: T
}

export default function ComboBox<T extends string & number & undefined>({ value }: Props<T>): JSX.Element {
  const [amount, setAmount] = useState<number>(1)

  return (
    <>
      <input
        id="amount-input"
        className="w-full h-full focus:outline-none px-5"
        type="text"
        value={value}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value)
          if (isNaN(parsed)) {
            return setAmount(0)
          }
          return setAmount(parsed)
        }}
      />
    </>
  )
}
