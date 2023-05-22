import { useEffect, useState } from "react"
import Authenticate from "./Authenticate"


const App = () => {
  const [value, setValue] = useState("")
  const [message, setMessage] = useState(null)
  const [preMessage, setPreMessage] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
    }

  
  const handleClick = (uniTitle) => {
      setCurrentTitle(uniTitle)
      setMessage(null)
      setValue("")
  }


   const getMessages = async () =>{
    const options ={
      method: "POST",
      body: JSON.stringify({
        message: value
        }),
      headers: {
        "content-type": "application/json"
        }
      }
    try{
      const response = await fetch ('http://localhost:8001/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
      } catch (error){
              console.error(error)
      }
    }

  useEffect(() =>{
    console.log(currentTitle,value, message)
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
      } if(currentTitle && value && message) {
      setPreMessage (prevChat => (
        [...prevChat,
        {
            title: currentTitle,
            role: "user",
            content: value
          },
          {   
            title: currentTitle,
            role: message.role,
            content: message.content

          }]
        ))
      }
    }, [message, currentTitle, value])

   console.log(preMessage)

  const currentChat = preMessage.filter(preMessage => preMessage.title === currentTitle)
  const uniqueTitle = Array.from(new Set(preMessage.map(preMessage => preMessage.title)))
  console.log(uniqueTitle)
  

  return (
    <div className="app">
    <section className="side-bar">
      <button onClick={createNewChat}>+ Chat New</button>
      <ul className="history">
       {uniqueTitle?.map((uniTitle, index) => 
        <li key={index} onClick={() => handleClick(uniTitle)}>
         {uniTitle}
        </li>
       )}

      </ul>
      <nav>
        <p>Made by Me</p>
        <Authenticate />
      </nav>
    </section>
    <section className="main">
      {!currentTitle && <h1>ChatGPT</h1>}
      <ul className="feed">
      {currentChat.map((chatMessage, index) =>
        <li key={index}>
          <p className="role">{chatMessage.role}</p>
          <p>{chatMessage.content}</p>
        </li>
        )}
      </ul>
      <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">Chat GPT may 02 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
      </div>
    </section>
    </div>
  );
}

export default App;
