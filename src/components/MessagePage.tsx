import { useGetReceivedMessageQuery, useGetSentMessageQuery } from "../slices/messageApiSlice";
import { USERINFO } from "../util/constants";
import { initialUserInfo } from "../util/initialForms";
import { UserInfo } from "../util/types/types";
import { LoadingPage } from "./LoadingPage";
import MessageList from "./MessageList";

export function MessagePage() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const username = userInfo.name

  const { data: receivedMessage, isLoading: rmLoading } = useGetReceivedMessageQuery(username)
  const { data: sentMessage, isLoading: smLoading } = useGetSentMessageQuery(username)
  
  if (rmLoading || smLoading) {
    return <LoadingPage/>
  }

  return (
    <MessageList
      receivedMessages={receivedMessage || []}
      sentMessages={sentMessage || []}
    />
  )
}