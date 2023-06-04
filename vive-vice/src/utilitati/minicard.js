import {useState, useEffect, useRef} from "react";
import Cookies from "js-cookie";
import axios from "axios";
export default function MiniCard({elemet,description}){
    const link = elemet
    const [url,setUrl] = useState("")

    async function getVideo(){
        const response = await axios.get(`http://localhost:5000/api/video/front/${elemet}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        })
        console.log(response.data.thumbnail)
        setUrl(response.data.thumbnail);
    } 

    const shooter = useRef(true)
    useEffect(()=>{
        if(shooter.current){
            shooter.current = false;
            getVideo();
        }
    },[])
    return(<div className="mini_video"><a href={`http://localhost:3000/video?id=${elemet}`}>
    {url?<img src={url} className="img_prin" width={"100%"} height={"100%"}></img>:<img className="image_gif" src="soon.gif"></img>}
       <div><p className="descriere_mini">{description}</p></div>
    </a></div>)
}