import Cookies from "js-cookie";
import "./video_add.css";
import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from "react-player";
export default function VideoAdd(){
const [video,setVideo] = useState();
const [thumbnail,setThumbnail] = useState();
const [videoSrc, setVideoSrc] = useState('');
const [pas,setPas] = useState(1);
const [descriere,setDescriere] = useState();

const btnRef = useRef();
const fileInputRef = useRef();

const [tags, setTags] = useState([]);
const [inputValue, setInputValue] = useState('');

const handleInputChange = (event) => {
  setInputValue(event.target.value);
};

const handleInputKeyPress = (event) => {
  if (event.key === 'Enter' && inputValue.trim() !== '') {
    const newTags = [...tags, inputValue.trim()];
    setTags(newTags);
    setInputValue('');
  }
};

const handleTagRemove = (removedTag) => {
  const newTags = tags.filter((tag) => tag !== removedTag);
  setTags(newTags);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  setVideo(file)
  console.log(file);
  const videoDataUrl = URL.createObjectURL(file)
  setVideoSrc(videoDataUrl);
};

const handleDelete = (event) => {
  URL.revokeObjectURL(videoSrc)
  setVideo()
  setVideoSrc("");
}

const handleInsertImage = () => {
  fileInputRef.current.click();
};

const handleF = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    setThumbnail(reader.result);
  };

  reader.readAsDataURL(file);
};

const reset = () => {
  setThumbnail("");
}

const setBtn = useRef();
if(!(Cookies.get("token"))){
    window.location.replace("http://localhost:3000");
}

function sendData(){
  if(video && thumbnail && tags && descriere){
    const formData = new FormData();
    formData.append('video',video);
    formData.append("thumbnail",thumbnail);
    formData.append('tags',tags);
    formData.append("descriere",descriere)
    const respone = axios.post('http://localhost:5000/api/upload',formData,{
     headers: {
      'x-access-token': Cookies.get('token')
     }
    })
  }
}

return(
<div className="video_add">
  <div className="video_add_container">
    <div className="pass_steps">
    <span onClick={()=>{setPas(1)}} id={pas==1?"active_s":""}></span>
    <span onClick={()=>{setPas(2)}} id={pas==2?"active_s":""}></span>
    <span onClick={()=>{setPas(3)}} id={pas==3?"active_s":""}></span>
    <span onClick={()=>{setPas(4)}} id={pas==4?"active_s":""}></span>
    </div>
    {
      pas == 1?<div className="video">
      {
        videoSrc?<div className="video_sure">
          <ReactPlayer controls width={'100%'} height={'100%'} url={videoSrc}></ReactPlayer>
        </div>:""
      }
      {!videoSrc?<div className="intro_video" onClick={()=>{btnRef.current.click()}}><i class="fa-solid fa-upload fa-2xl"></i> <p>Adauga continut</p></div>:""}
      {!videoSrc?<input accept="video/*" ref={btnRef} onChange={handleFileChange} hidden type="file" id="video"></input>:""}
      {
        videoSrc?<div className="vd_button"><button onClick={handleDelete}>Schimba Contintul</button><button onClick={()=>{setPas(2)}}>Treci la pasul urmator</button></div>:""
      }
      </div>
      :
      null
    }
    {
      pas == 2? <div className="des_video"><h1>Adauga Descriere</h1><textarea onChange={(e)=>{setDescriere(e.target.value)}}></textarea>
      <div style={{width: '80%',display: 'flex', justifyContent: 'space-around',alignItems: 'center',padding: '20px'}}><button onClick={()=>{setPas(1)}}>Inapoi</button><button onClick={()=>{setPas(3)}}>Inainte</button></div>
      </div>:""
    }
    {
      pas === 3? <div className="thumbnail">
      {thumbnail?<div className="thumbnail_Ol"><div className="add_inside"><img src={thumbnail} alt="Photo" className="photo"/><div onClick={reset} className="inside1"><i class="fa-solid fa-circle-xmark fa-xl"></i></div></div><div class="t3"><button onClick={()=>{setPas(2)}}>Inapoi</button><button onClick={()=>{setPas(4)}}>Inainte</button></div></div>:""}
      {!thumbnail?<div className="photo-container" onClick={handleInsertImage}>
      <i class="fa-solid fa-upload fa-2xl"></i>
      <p>Adauga thumbnail</p>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleF}
        style={{"display": "none"}}
      />
    </div>: ""}</div>: ""
    }
    {
      pas === 4?
      <div className="tags">
      <div className="tag_input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder="Adauga tag-uri"
        />
      </div>
      <div className="re_tag">
        {tags.map((tag) => (
          <div key={tag} className="tag">
            <p>{tag}</p>
            <button onClick={() => handleTagRemove(tag)}><i class="fa-solid fa-circle-xmark fa-xl"></i></button>
          </div>
        ))}
      </div>
      <button onClick={()=>{sendData()}} id="bt1">Trimite</button>
    </div> :""
    }
  </div>
</div>
)
}