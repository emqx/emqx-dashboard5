import { useI18n } from 'vue-i18n'

export default function useAuth(): {
  titleMap: {
    [key: string]: string
  }
} {
  const { t } = useI18n()
  const titleMap = {
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    http: t('Auth.HTTPServer'),
    built_in_database: t('Auth.builtInDatabase'),
    jwt: 'JWT',
    redis: 'Redis',
    mongodb: 'MongoDB',
    file: 'File',
    ldap: 'LDAP',
    kerberos: 'Kerberos',
    cinfo: 'Client Info',
  }
  return {
    titleMap,
  }
}
