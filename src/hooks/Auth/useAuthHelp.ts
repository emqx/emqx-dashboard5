import useI18nTl from '../useI18nTl'
import {
  AUTHZ_COMMON_PLACEHOLDERS,
  AUTHZ_HTTP_PLACEHOLDERS,
  AUTHZ_MONGODB_PLACEHOLDERS,
  AUTH_PLACEHOLDERS,
  AUTH_PLACEHOLDER_CLIENT_ATTRS,
} from '@/common/constants'
import codeMapInHelpOfAuth from '@/common/codeMapInHelpOfAuth'
import { computed, ComputedRef, inject } from 'vue'

export default (context: {
  authType: 'authn' | 'authz'
  databaseType: 'mysql' | 'postgresql' | 'mongodb' | 'redis' | 'http' | undefined
}): {
  helpText: ComputedRef<string[]>
  helpCode: ComputedRef<string>
} => {
  const { t, tl } = useI18nTl('AuthDoc')
  const gateway = inject('gateway')
  let authnHTTPParagraph2 = `${tl('authnHTTPParagraph2')}${AUTH_PLACEHOLDERS}`
  if (gateway === 'mqttsn') {
    authnHTTPParagraph2 = authnHTTPParagraph2.replace(', ${username}, ${password}', '')
  }
  const helpTextMap = {
    authn: {
      mysql: [
        t('AuthDoc.authnSQLParagraph1', ['MySQL']),
        tl('authnSQLParagraph2'),
        `${t('AuthDoc.supportedPlaceholders', ['SQL'])}${AUTH_PLACEHOLDERS}`,
        tl('clientTableExample'),
      ],
      mongodb: [
        tl('authnMongoDBParagraph1'),
        tl('authnMongoDBParagraph2'),
        `${t('AuthDoc.supportedPlaceholders', [tl('selector')])}${AUTH_PLACEHOLDERS}`,
        tl('clientTableExample'),
      ],
      postgresql: [
        t('AuthDoc.authnSQLParagraph1', ['PostgreSQL']),
        tl('authnSQLParagraph2'),
        `${t('AuthDoc.supportedPlaceholders', ['SQL'])}${AUTH_PLACEHOLDERS}`,
        tl('clientTableExample'),
      ],
      redis: [
        tl('authnRedisParagraph1'),
        tl('authnSQLParagraph2'),
        `${t('AuthDoc.supportedPlaceholders', [tl('CMD')])}${AUTH_PLACEHOLDERS}`,
        tl('dataStructuresAndCommandExamples'),
      ],
      http: [tl('authnHTTPParagraph1'), authnHTTPParagraph2, tl('authnHTTPParagraph3')],
    },
    authz: {
      mysql: [
        t('AuthDoc.authzSQLParagraph1', ['MySQL']),
        `${t('AuthDoc.authzSupportedPlaceholders', ['SQL'])}${AUTHZ_COMMON_PLACEHOLDERS}`,
        tl('theTableStructureExample'),
      ],
      mongodb: [
        tl('authzMongoDBParagraph1'),
        `${t('AuthDoc.authzSupportedPlaceholders', [tl('selector')])}${AUTHZ_MONGODB_PLACEHOLDERS}`,
        tl('dataStructureExample'),
      ],
      postgresql: [
        t('AuthDoc.authzSQLParagraph1', ['PostgreSQL']),
        `${t('AuthDoc.authzSupportedPlaceholders', ['SQL'])}${AUTHZ_COMMON_PLACEHOLDERS}`,
        tl('theTableStructureExample'),
      ],
      redis: [
        tl('authzRedisParagraph1'),
        `${t('AuthDoc.authzSupportedPlaceholders', [tl('CMD')])}${AUTHZ_COMMON_PLACEHOLDERS}`,
        tl('dataStructuresAndCommandExamples'),
      ],
      http: [tl('authzHTTPParagraph1'), `${tl('authnHTTPParagraph2')}${AUTHZ_HTTP_PLACEHOLDERS}`],
    },
  }

  const helpText = computed(() => {
    const { authType, databaseType } = context
    if (!databaseType) {
      return []
    }
    let ret = helpTextMap[authType][databaseType]
    if (gateway) {
      ret = ret.map((item) => item.replace(AUTH_PLACEHOLDER_CLIENT_ATTRS, ''))
    }
    return ret
  })

  const helpCode = computed(() => {
    const { authType, databaseType } = context
    if (databaseType === 'http' || !databaseType) {
      return ''
    }
    return codeMapInHelpOfAuth[authType][databaseType]
  })

  return {
    helpText,
    helpCode,
  }
}
