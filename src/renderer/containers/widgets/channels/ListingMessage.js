import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import ListingMessageComponent from '../../../components/widgets/channels/ListingMessage'
import { actionCreators } from '../../../store/handlers/modals'
import ratesSelectors from '../../../store/selectors/rates'

export const mapStateToProps = state => ({
  rateUsd: ratesSelectors.rate('usd')(state)
})
export const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      buyActions: (modalName, payload) =>
        actionCreators.openModal(modalName, payload)()
    },
    dispatch
  )
const ListingMessage = ({ message, rateUsd, ...props }) => {
  const payload = {
    provideShipping: message.message.provideShipping === '1',
    tag: message.message.tag,
    description: message.message.description,
    background: message.message.background,
    title: message.message.title,
    priceUSD: message.message.amount,
    priceZcash: rateUsd
      .div(rateUsd.times(rateUsd))
      .times(message.message.amount)
      .toFixed(4, BigNumber.ROUND_CEIL)
      .toString(),
    offerOwner: message.sender.username,
    id: message.id,
    address: message.sender.replyTo,
    createdAt: message.createdAt,
    status: message.status
  }
  return (
    <ListingMessageComponent payload={payload} message={message} {...props} />
  )
}
export default R.compose(connect(mapStateToProps, mapDispatchToProps))(
  React.memo(ListingMessage, (before, after) =>
    Immutable.is(after.message, before.message)
  )
)
