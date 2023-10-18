import { useState } from "react";
import { database, storage } from "../../firebase/firebase";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  list as sList,
} from "firebase/storage";
import { push, ref} from "firebase/database";
import { Paperclip, SendHorizontal, Check } from 'lucide-react';
import questions from './questions.json'
import ContextHelper from "../Helpers/ContextHelper";



export function ChatComposer(props) {
    const [formInfo, setFormInfo] = useState({
        fileArray: [],
        chatMessage: "",
        date: null,
    });
    const userEmail = ContextHelper("email");
    const pairKey = ContextHelper("pairKey");

    const textChange = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        setFormInfo((prevState) => {
            return { ...prevState, [name]: value };
        });
    };

    const getRandomIndex = (max) => Math.floor(Math.random() * max);

    const pullQuestion = (e) => { //qns from: https://github.com/joshsuson/conversation-starter
        e.preventDefault();
        const randomQuoteIndex = getRandomIndex(questions.questions.length);
        setFormInfo((prevState) => {
           return { ...prevState, chatMessage: questions.questions[randomQuoteIndex] };
       });
    }

    const imgChange = (e) => {
        setFormInfo((prevState) => {
          return { ...prevState, fileArray: Object.values(e.target.files)};
        });
      };

    const writeData = (event) => {
        event.preventDefault();
        const fileRefArray = [];
        sList(sRef(storage, `rooms/${pairKey}/chatImages/`), null)
          .then((result) => {
            if (formInfo.fileArray.length === 0) {
              return [];
            } else {
              return Promise.all(
                  formInfo.fileArray.map(async (file, index) => {
                  fileRefArray.push(sRef(storage, `rooms/${pairKey}/chatImages/image${result.items.length + index}`))
                  return uploadBytes(fileRefArray[index], file)
                })
              )
            }
          })
          .then(() => Promise.all(fileRefArray.map((fileRef)=>getDownloadURL(fileRef))))
          .then((urlArray) => {
            const messageListRef = ref(database, `rooms/${pairKey}/chat`);
            push(messageListRef, {
              user: userEmail,
              message: formInfo.chatMessage,
              date: `${new Date().toLocaleString()}`,
              files: urlArray,
            });
          })
          .then(() => {
            //reset form after submit
            setFormInfo({
              fileArray: [],
              chatMessage: "",
              date: null,
            });
          });
      };

      const generateUploadFileText = (fileArray) => {
        const uploadFileText = ''
        if (fileArray.length === 1) {
          return (`Pending upload: ${formInfo.fileArray[0].name}`)
        } else if (fileArray.length > 1) {
          return (`Pending upload: ${fileArray.length} files`)
        }
      }

    return (
        <form onSubmit={writeData} className="bg-window w-full fixed bottom-0 border-black border-t-2">
            <table className='w-full rounded-md'>
                <tr className=''>
                    <td className='w-5/6  text-center'>
                    <button onClick = {pullQuestion} className = 'bg-text rounded-md border-black border-2 text-accent'>Get random question 🚀</button>
                    <br />
                    {console.log(formInfo.fileArray)}
                    {generateUploadFileText(formInfo.fileArray)}
                    </td>
                    <td className='w-1/6'>
                        <label for='file-input' className = 'flex justify-center'>
                        <Paperclip />
                        {formInfo.fileArray.length > 0 ? <Check color="#18fb20" /> : null}
                        </label>
                        <input
                            id='file-input'
                            type="file"
                            accept='image/*'
                            onChange={(e) => {
                                imgChange(e);
                            }}
                            style={{ display: "none" }}
                            multiple
                        />
                        
                    </td>
                </tr>
                <tr className='h-2/3'>
                    <td className='w-5/6 box-border m-0'>
                        <textarea
                            type="text"
                            rows='2'
                            id="chatMessage"
                            placeholder="enter message here:"
                            onChange={(e) => {
                                textChange(e);
                            }}
                            value={formInfo.chatMessage}
                            className="text-black rounded-lg box-border w-full h-full border-black border-2 m-0 p-2" // how to get it to expand
                        />
                    </td>
                    <td >
                        <label for='submitMessage' className='flex justify-center'>
                            <SendHorizontal />
                        </label>

                        <input type="submit" value="Send" id='submitMessage' style={{ display: "none" }}/>
                    </td>
            </tr>
            </table>
        </form>
    );
}