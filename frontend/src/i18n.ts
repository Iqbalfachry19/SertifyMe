import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslations from "./locales/en.json"
import idTranslations from "./locales/id.json"
import msTranslations from "./locales/ms.json"
import thTranslations from "./locales/th.json"
import viTranslations from "./locales/vi.json"
import { certificateViewTranslations } from "./locales/certificateView"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: {
          ...enTranslations,
          ...certificateViewTranslations.en,
          languageCode: "en-US"
        }
      },
      id: { 
        translation: {
          ...idTranslations,
          ...certificateViewTranslations.id,
          languageCode: "id-ID"
        }
      },
      ms: { 
        translation: {
          ...msTranslations,
          ...certificateViewTranslations.ms,
          languageCode: "ms-MY"
        }
      },
      th: { 
        translation: {
          ...thTranslations,
          ...certificateViewTranslations.th,
          languageCode: "th-TH"
        }
      },
      vi: { 
        translation: {
          ...viTranslations,
          ...certificateViewTranslations.vi,
          languageCode: "vi-VN"
        }
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n