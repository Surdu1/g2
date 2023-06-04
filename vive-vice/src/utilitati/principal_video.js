import {useState, useEffect, useRef} from "react";
import axios from "axios";
import Cookies from "js-cookie";
export default function PrincipalVideo({element,description}){
    const[url,setUrl] = useState("");

    async function getVideo(){
        const response = await axios.get(`http://localhost:5000/api/video/front/${element}`,{
            headers: {
                'x-access-token': Cookies.get('token'),
            },
        })
        console.log(response.data.thumbnail)
        setUrl(response.data.thumbnail);
    }  
    const shooter = useRef(true);
    useEffect(()=>{
        if(shooter.current){
            shooter.current = false;
            getVideo();
        }
    },[])
    return(<div className="p_video">
       <a href={`http://localhost:3000/video?id=${element}`}>
       {url?<div className="img_edit"><img width={"100%"}  src={url}/></div>:<div className="img_edit mic"><img width={"100%"}  src={'soon1.gif'}/></div>}
       <p className="desc_p">{description}</p>
       </a>
    </div>)
}