import { Context, Schema } from 'koishi'

export const name = 'abbreviation'

export interface Config {
  endpoint: string
}

export const Config: Schema<Config> = Schema.object({
  endpoint: Schema.string().role('link').default('https://lab.magiconch.com/api/nbnhhsh/guess').description('API 地址。'),
})

function getResult(entry: any) {
  if (entry.trans) return entry.trans.join(', ')
  if (entry.inputting) return entry.inputting.join(', ')
  return '未找到对应的缩写。'
}

export function apply(ctx: Context, config: Config) {
  ctx.command('abbr <text:text>', '中文缩写查询')
    .action(async (_, text) => {
      if (!text) return '请输入文本。'
      const data = await ctx.http.post(config.endpoint, { text })
      if (!data?.length) return `未提取到输入文本。`
      console.log(data)
      return data
        .map((entry) => `${entry.name}：${getResult(entry)}`)
        .join('\n')
    })
}
