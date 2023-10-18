import {ImageCarousel} from '../Feed/ImageCarousel';

//<Message chatMessage={chatMessage} key={message.key} postIndex={index} />
export function Message(props) {
    const DB_CHAT_KEY = `chat`;

    return (  
    <div className = {`break-words flex flex-row ${props.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
        <div className={` ${props.sender === 'self' ? 'bg-window' : 'bg-background'} shadow-lg  text-accent m-2 max-h-1/5 p-2 rounded-lg break-words`}  key={props.chatMessage.key}>
            {props.chatMessage.val.files ? <ImageCarousel urlArray = {props.chatMessage.val.files ? props.chatMessage.val.files:[]} />: null}
            {props.chatMessage.val.message}
            <br />
            <p className = 'text-right text-xs'>{props.chatMessage.val.date.slice(12)}</p>
        </div>
    </div>

    )
}