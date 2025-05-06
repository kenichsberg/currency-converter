import { initTranslations } from '@/app/i18n.js'
import CurrencyConversionForm from '@/app/[locale]/CurrencyConversionForm.js'
import TranslationsProvider from '@/app/[locale]/components/TranslationProvider.js'

type Props = {
  params: Promise<{ locale: string }>
}

const i18nNamespaces = ['translation']

export default async function Home({ params }: Props) {
  const { locale } = await params
  const { resources } = await initTranslations(locale, ['home'])

  return (
    <TranslationsProvider namespaces={i18nNamespaces} locale={locale} resources={resources}>
      <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-teal-800">
        <main className="flex row-start-2 items-center sm:items-start w-full">
          <div className="bg-white px-10 py-20 w-full rounded-3xl">
            <CurrencyConversionForm />
          </div>
        </main>
      </div>
    </TranslationsProvider>
  )
}
