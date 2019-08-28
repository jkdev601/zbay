import { connect } from 'react-redux'

import ChannelHeader from '../../../components/widgets/channels/ChannelHeader'

import channelSelectors from '../../../store/selectors/channel'

export const mapStateToProps = state => {
  const members = channelSelectors.messages(state).reduce((acc, msg) => {
    return acc.add(msg.sender.replyTo)
  }, new Set())
  return {
    channel: channelSelectors.data(state),
    members: members
  }
}

export default connect(mapStateToProps)(ChannelHeader)
