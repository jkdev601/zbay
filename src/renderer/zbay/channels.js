import * as Yup from 'yup'

import { inflate, deflate } from '../compression'
import { DOMAIN } from '../../shared/static'

export const getChannelUrl = hash =>
  `https://${DOMAIN}/importchannel=${encodeURIComponent(hash)}`

export const URI_PREFIX = `https://${DOMAIN}/importchannel=`
export const ADDRESS_PREFIX = 'zbay://uri/'

export const getZbayAddress = zcashAddress => `${ADDRESS_PREFIX}${zcashAddress}`
export const getZbayChannelUri = hash => `${URI_PREFIX}${hash}`

const channelSchema = Yup.object().shape({
  name: Yup.string().required(),
  ivk: Yup.string().required()
})

const _inflateOrThrow = async hash => {
  try {
    const channel = await inflate(hash)
    return channel
  } catch (_) {
    throw new Error(`Invalid channel hash: ${hash}`)
  }
}

export const uriToChannel = async uri => {
  const hash = uri
  const channel = await _inflateOrThrow(hash)
  try {
    const validated = await channelSchema.validate(channel)
    return { name: validated.name, keys: { ivk: validated.ivk } }
  } catch (err) {
    throw new Error(`Incorrect export format for ${uri}: ${err}`)
  }
}

export const channelToUri = async channel => {
  const exportable = {
    name: channel.name,
    ivk: channel.keys.ivk
  }
  const hash = await deflate(exportable)
  return getChannelUrl(hash)
}

export default {
  uriToChannel,
  getZbayAddress,
  getZbayChannelUri
}
