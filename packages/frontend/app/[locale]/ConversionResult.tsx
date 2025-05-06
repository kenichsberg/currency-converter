'use client'
import { JSX } from 'react'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import type { ConvertRes, SimpleMessageRes } from 'common/dist/index.js'

type Props = {
  amountToConvert: number
  fromCurrency: string
  toCurrency: string
  shouldSendRequest: boolean
}

type HttpResponseError = Error & { info?: any; status?: number }

async function fetcher(...args: Parameters<typeof fetch>) {
  const res = await fetch(...args)
  if (!res.ok) {
    const error: HttpResponseError = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    console.log(error.info)
    error.status = res.status
    throw error
  }
  return res.json()
}

function errorToMessage(error: HttpResponseError, fallback: string): string {
  console.log(error)
  if (!error.info) {
    return error.message ?? fallback
  }

  const info = error.info
  console.log(info instanceof Array)
  if (info instanceof Array) {
    return info[0].message ?? fallback
  }

  return info.message ?? fallback
}

function ConversionResultAmount({
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
}: {
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
}): JSX.Element {
  const { t } = useTranslation()
  return (
    <>
      <span>
        {t('conversion', {
          ns: 'translation',
        })}
      </span>
      <span>
        {t('conversionFrom', {
          amount: fromAmount,
          ns: 'translation',
          formatParams: {
            amount: { currency: fromCurrency },
          },
        })}
      </span>
      <span>=</span>
      <span>
        {t('conversionTo', {
          amount: toAmount,
          ns: 'translation',
          formatParams: {
            amount: { currency: toCurrency },
          },
        })}
      </span>
    </>
  )
}

export default function ConversionResult({
  amountToConvert,
  fromCurrency,
  toCurrency,
  shouldSendRequest,
}: Props): JSX.Element {
  const { data, error, isLoading } = useSWR<ConvertRes, HttpResponseError>(
    // TODO take host from env, add to global config
    !shouldSendRequest ? null : `http://localhost:3000/api/convert/${fromCurrency}/${toCurrency}`,
    fetcher,
  )

  if (error) {
    switch (error.status) {
      case 400:
      case 422:
        return <span>{errorToMessage(error, 'Invalid inputs')}</span>
      default:
        return <span>Error</span>
    }
  }
  if (isLoading) {
    return <span>loading...</span>
  }

  if (!data) return <></>
  if ('message' in data) {
    return <>{data.message}</>
  }

  const resultAmount = data.rate * amountToConvert

  return (
    <ConversionResultAmount
      fromAmount={amountToConvert}
      toAmount={resultAmount}
      fromCurrency={fromCurrency}
      toCurrency={toCurrency}
    />
  )
}
