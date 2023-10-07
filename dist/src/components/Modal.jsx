export default function Modal ({pic, vid, src}) {

    if(pic === false) {
        return(
            <div className="Modal">
                <video src={src}></video>
            </div>
        )
    } 
    
    console.log(src);
    return(
        <div className="Modal">
            <img src={src} alt="" width={200} />
        </div>
    )
}