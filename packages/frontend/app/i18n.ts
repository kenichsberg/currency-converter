import { i18n, Resource, createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import i18nConfig from '@/i18nConfig'

async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource,
) {
  i18nInstance = i18nInstance ?? createInstance()

  i18nInstance.use(initReactI18next)

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/public/locales/${language}/${namespace}.json`),
      ),
    )
  }
  console.log(locale, namespaces, i18nInstance, resources)

  await i18nInstance.init({
    lng: locale,
    resources: resources ?? {
      en: {
        translation: {
          conversion: 'Conversion Result:',
          conversionFrom: '{{amount, currency}}',
          conversionTo: '{{amount, currency}}',
        },
      },
      fi: {
        translation: {
          conversion: 'Muuntamisen tulos:',
          conversionFrom: '{{amount, currency}}',
          conversionTo: '{{amount, currency}}',
        },
      },
      ru: {
        translation: {
          conversion: 'Результат конвертации:',
          conversionFrom: '{{amount, currency}}',
          conversionTo: '{{amount, currency}}',
        },
      },
      ja: {
        translation: {
          conversion: '為替換算結果:',
          conversionFrom: '{{amount, currency}}',
          conversionTo: '{{amount, currency}}',
        },
      },
    },
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
    interpolation: {
      escapeValue: false,
      /*
      format: (value: any, format: string = '', lng: string = '', options?: any) => {
        if (format === 'currency') {
          const currency = options?.currency || 'USD'
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency,
          }).format(Number(value))
        }
        return value
      },
      */
    },
  })

  return {
    i18n: i18nInstance,
    resources: { [locale]: i18nInstance.services.resourceStore.data[locale] },
    t: i18nInstance.t,
  }
}

export { initTranslations }
