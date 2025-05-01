'use client'
import { useState } from 'react'
import ConversionResult from '@/app/conversion-result'

export default function Form() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>('EUR')
  const [toCurrency, setToCurrency] = useState<string>('USD')

  return (
    <>
      <form
        id="converter-form"
        onSubmit={(event) => {
          event.preventDefault()
          //handleSubmit(onSubmit, onError)()
        }}
      >
        <div className="flex gap-4 items-center justify-evenly w-full">
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="amount-input" className="absolute top-2 left-3 text-slate-500">
              Amount
            </label>
            <input
              id="amount-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              value={amount}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value)
                if (isNaN(parsed)) {
                  return setAmount(0)
                }
                return setAmount(parsed)
              }}
            />
          </div>
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="from-input" className="absolute top-2 left-3 text-slate-500">
              From
            </label>
            <input
              id="from-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            />
          </div>
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="to-input" className="absolute top-2 left-3 text-slate-500">
              To
            </label>
            <input
              id="to-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            />
          </div>
        </div>
      </form>
      <ConversionResult amountToConvert={amount} fromCurrency={fromCurrency} toCurrency={toCurrency}></ConversionResult>
    </>
  )
}
