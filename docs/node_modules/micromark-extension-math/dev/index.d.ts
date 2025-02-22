export {mathHtml, type Options as HtmlOptions} from './lib/html.js'
export {math, type Options} from './lib/syntax.js'

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    mathFlow: 'mathFlow'
    mathFlowFence: 'mathFlowFence'
    mathFlowFenceMeta: 'mathFlowFenceMeta'
    mathFlowFenceSequence: 'mathFlowFenceSequence'
    mathFlowValue: 'mathFlowValue'
    mathText: 'mathText'
    mathTextData: 'mathTextData'
    mathTextPadding: 'mathTextPadding'
    mathTextSequence: 'mathTextSequence'
  }

  interface CompileData {
    mathFlowOpen?: boolean
  }
}
