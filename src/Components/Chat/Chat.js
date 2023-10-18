import {Message} from './Message'

const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

//<Chat chat={chat} />
export function Chat(props) {
    const messages = props.chat.map((chatMessage, index) => {
            return <Message 
            chatMessage={chatMessage} 
            key={chatMessage.key} 
            postIndex={index} 
            sender={DUMMY_USERID === chatMessage.val.user ? 'self' : 'other'} />
    })

    return (      
            <div className='flex flex-col max-w-screen h-full'>
                {messages}
            </div>
    )
}