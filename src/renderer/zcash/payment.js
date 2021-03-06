import * as Yup from 'yup'
import { networkFee } from '../../shared/static'
const amountsSchema = Yup.array()
  .of(
    Yup.object().shape({
      address: Yup.string().required(),
      amount: Yup.string().required(),
      memo: Yup.string()
    })
  )
  .min(1)

export default zcashClient => {
  const received = async address =>
    zcashClient.request.z_listreceivedbyaddress(address, 0)

  const unspentNotes = async ({
    minConfirmations = 1,
    maxConfirmations = 9999999,
    includeWatchonly = false,
    addresses = []
  }) =>
    zcashClient.request.z_listunspent(
      minConfirmations,
      maxConfirmations,
      includeWatchonly,
      addresses
    )

  const send = async ({
    from,
    amounts,
    minConfirmations = 1,
    fee = networkFee
  }) => {
    await amountsSchema.validate(amounts)
    return zcashClient.request.z_sendmany(from, amounts, minConfirmations, fee)
  }

  const shield = async ({ from, to, fee = networkFee, limit = 50 }) =>
    zcashClient.request.z_shieldcoinbase(from, to, fee, limit)

  return {
    unspentNotes,
    received,
    send,
    shield
  }
}
