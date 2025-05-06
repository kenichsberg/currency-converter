'use client'
import { JSX, useState, useRef, FormEvent } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { Input } from 'react-aria-components'
import ConversionResult from '@/app/[locale]/ConversionResult.js'
import ComboBox from '@/app/[locale]/components/ComboBox.js'
import { CURRENCY_CODES } from 'common/dist/index.js'

type Inputs = {
  amount: number
  fromCurrency: string
  toCurrency: string
}

const defaultAmount = 1
const defaultFromCurrency = 'EUR'
const defaultToCurrency = 'USD'

export default function CurrencyConversionForm(): JSX.Element {
  const [fromCurrency, setFromCurrency] = useState<string>(defaultFromCurrency)
  const [toCurrency, setToCurrency] = useState<string>(defaultToCurrency)
  const {
    register,
    watch,
    //handleSubmit,
    formState: { isValid, errors },
  } = useForm<Inputs>()

  return (
    <>
      <form id="converter-form" onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-4 items-center justify-evenly w-full">
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="amount-input" className="absolute top-2 left-3 text-slate-500">
              Amount
            </label>
            <Input
              {...register('amount')}
              id="amount-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              defaultValue={defaultAmount}
            />
          </div>
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="from-input" className="absolute top-2 left-3 text-slate-500">
              From
            </label>
            <ComboBox
              {...register('fromCurrency', { required: true })}
              label="From"
              list={CURRENCY_CODES}
              id="from-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              defaultInputValue={defaultFromCurrency}
              isDisabled={true}
              onInputChange={setFromCurrency}
            />
          </div>
          <div className="relative flex-1 h-[5rem] rounded-lg border-1 border-gray-200">
            <label htmlFor="to-input" className="absolute top-2 left-3 text-slate-500">
              To
            </label>
            <ComboBox
              {...register('toCurrency', { required: true })}
              label="To"
              list={CURRENCY_CODES}
              id="from-input"
              className="w-full h-full focus:outline-none px-5"
              type="text"
              defaultInputValue={defaultToCurrency}
              onInputChange={setToCurrency}
            />
          </div>
        </div>
      </form>
      <ConversionResult
        amountToConvert={watch('amount')}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        shouldSendRequest={isValid}
      />
    </>
  )
}
