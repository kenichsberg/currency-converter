import { JSX } from 'react'
import useSWR from 'swr'

type Props = {
  amountToConvert: number
  fromCurrency: string
  toCurrency: string
}

// TODO move to `shared` folder
type Quote = {
  fromCurrency: string
  toCurrency: string
  rate: number
  date: string
  fromAmount: number
  toAmount: number
}

async function fetcher(...args: Parameters<typeof fetch>) {
  return (await fetch(...args)).json()
}

export default function ConversionResult({ amountToConvert, fromCurrency, toCurrency }: Props): JSX.Element {
  const { data, error } = useSWR<Quote, Error>(
    // TODO take host from env, add to global config
    `http://localhost:3000/api/convert/${fromCurrency}/${toCurrency}/${amountToConvert}`,
    fetcher,
  )

  if (error) {
    return <span>Error</span>
  }
  if (!data) {
    return <span>loading...</span>
  }
  return <span>{data.toAmount}</span>
}
