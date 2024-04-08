import { PluginStatus } from './enum'

export interface PluginItem {
  running_status: Array<{
    node: string
    status: PluginStatus
  }>
  authors: Array<string>
  builder: {
    contact: string
    name: string
    website: string
  }
  built_on_otp_release: string
  compatibility: {
    emqx: string
  }
  date: string
  description: string
  functionality: Array<string>
  git_ref: string
  metadata_vsn: string
  name: string
  rel_apps: Array<string>
  rel_vsn: string
  repo: string
  git_commit_or_build_date: string
}

export interface PluginDetail extends PluginItem {
  readme: string
}

interface Metadata {
  author: string
  release_date: string
  links: Array<{
    name: string
    link: string
  }>
  licenses: any[]
  emqx_version: Array<string>
}
