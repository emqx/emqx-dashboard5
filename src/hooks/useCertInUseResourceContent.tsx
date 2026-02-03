import { ChevronRight } from 'lucide-vue-next'

const useCertInUseResourceContent = () => {
  const { tl, t } = useI18nTl('BasicConfig')
  const getCertInUseResourceContent = (referencingConfigs: Record<string, string[][]>) => {
    const namespaceList = Object.keys(referencingConfigs)
    return (
      <>
        <p>{tl('certBundleInUseMsg')}</p>
        <ul>
          {namespaceList.map((namespace) => {
            const dataArr = referencingConfigs[namespace]
            return (
              <li>
                <h4>
                  {tl('namespace')}
                  {t('Base.colon')} {namespace}
                </h4>
                <ul>
                  {dataArr.map((data: string[]) => {
                    return (
                      <li class="flex items-center">
                        {data.map((item: string, index: number) => {
                          return (
                            <>
                              <span key={item}>{item} </span>
                              {index < data.length - 1 && (
                                <ChevronRight class="mx-1" size={16} strokeWidth={1} />
                              )}
                            </>
                          )
                        })}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
        <p>{tl('certBundleForceDeleteWarning')}</p>
      </>
    )
  }
  return { getCertInUseResourceContent }
}

export default useCertInUseResourceContent
