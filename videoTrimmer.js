// import { saveAs } from 'file-saver';
// saveAs(Blo)

const videoinput = document.getElementById('videofile')
const CTA = document.getElementById('CTA')
const tester= document.querySelector('.test')
const formbutton = document.querySelector('form button')
const video= document.querySelector('video')
const playPauseButton = document.querySelector('.pp')
const h3= document.querySelector('.videoplayer p')
const time = document.querySelector('p.time')
const reading = document.querySelector('span#reading')
const duration = document.querySelector('span#duration')
const totalTimeline = document.querySelector('.total-duration')
const currentTimeline = document.getElementById('timeline')
const trackButton = document.getElementById('tracker')
const trimLeftBtn = document.querySelector('div.left')
const trimRightBtn = document.querySelector('div.right')
const trimBtn = document.getElementById('trim-button')
const clearBtn = document.getElementById('clear-button')
const LtrimText = document.querySelector('.left span')
const RtrimText = document.querySelector('.right span')

const startfig = document.querySelector('#startf')
let radix;

videoinput.addEventListener('change',e => {
    CTA.style.display='none'
    document.querySelector('.control-container').classList.add('active')
    
    let file = videoinput.files[0]
    console.log(file)
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
//    
        var mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", sourceOpen);
        console.log(mediaSource.readyState); // closed
        const blob = URL.createObjectURL(mediaSource)
        video.src = blob
        console.log(mediaSource.readyState)
        // const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
       
        // function sourceOpen(){console.log(mediaSource.readyState)}
        function sourceOpen() {
    console.log(this.readyState); // open
    const mediaSource = this;
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    fetchAB(file, (buf) => {
        sourceBuffer.addEventListener("updateend", () => {
        mediaSource.endOfStream();
        video.play();
        console.log(mediaSource.readyState); // ended
        });
        sourceBuffer.appendBuffer(buf);
    });
    }

function fetchAB(url, cb) {
    console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      cb(xhr.response);
    };
    xhr.send();
  }

            // const source = new MediaSource()
            // source.addEventListener("sourceopen", ready);
            // const blob = URL.createObjectURL(source)
            // video.src= blob
            // console.log(source.readyState)
            // let result


            // function ready(){
            //     console.log(source.readyState)
            //     const srcBuffers = source.addSourceBuffer(mimeCodec)
            //     let file = videoinput.files[0]
            //     let reader = new FileReader()
            //     reader.readAsArrayBuffer(file)
            //     reader.onload=()=>{
            //         result = reader.result
            //             srcBuffers.addEventListener('updatestart',(e)=>{
                               
            //                     console.log(result)
            //                 })
            //                 srcBuffers.appendBuffer(result)
            //                 srcBuffers.addEventListener('updateend',(e)=>{
            //                     source.endOfStream()
            //                     console.log('finished')
            //                 })
                    
            //     }
            // }

            // console.log(source.readyState) 
           

})

video.onloadeddata = ()=> {
    reading.textContent= logTime(video.currentTime)
    duration.textContent= logTime(video.duration)
}
video.ontimeupdate= (e)=> {
    reading.textContent= logTime(video.currentTime)
    const percent = video.currentTime/video.duration
    trackButton.style.setProperty('--currentPosition',percent)
    currentTimeline.style.setProperty('--currentPos',percent)
    startfig.value = video.currentTime
}
video.onended = ()=> {
    playPauseButton.classList.add('paused')
}



totalTimeline.addEventListener('pointerdown', changeScrubbing)

function changeScrubbing(e){
    let sqr = totalTimeline.getBoundingClientRect()
    const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
   
    if  (e.target == trackButton & !trackButton.hasAttribute('hidden')){
        trackButton.setPointerCapture(e.pointerId);
        video.currentTime = percentage * video.duration
            if (!playPauseButton.classList.contains('paused')){
                 video.pause()
                 playPauseButton.classList.toggle('paused')
             } 

    }else if(e.target==trimLeftBtn & !trimLeftBtn.hasAttribute('hidden')){
        console.log('left')
        trimLeftBtn.setPointerCapture(e.pointerId);

    }else if(e.target==trimRightBtn & !trimRightBtn.hasAttribute('hidden')){
        console.log('right')
        trimRightBtn.setPointerCapture(e.pointerId);
    }console.log(video.currentTime)
  
    totalTimeline.onpointermove = function(e) {
        let sqr = totalTimeline.getBoundingClientRect()
        let rightSqr = trimRightBtn.getBoundingClientRect()
        let leftSqr = trimLeftBtn.getBoundingClientRect()
        const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
        const leftWidth = `${rightSqr.x - leftSqr.x}px`
        let LValue = leftSqr.x/ sqr.width * video.duration
        let RValue = rightSqr.x/ sqr.width * video.duration
        currentTimeline.style.setProperty('--preview',percentage)
        LtrimText.textContent = LValue.toFixed(4)
        RtrimText.textContent = RValue.toFixed(4)
        

        if (e.target == trackButton){
            trackButton.style.setProperty('--currentPosition',percentage)
            currentTimeline.style.setProperty('--currentPos',percentage)
        }

        if (e.target ==  trimLeftBtn){
            console.log(e.pointerId, video.duration)
            trimLeftBtn.style.setProperty('--bound',percentage)
            trimLeftBtn.style.setProperty('--dist',leftWidth)
            video.currentTime = LValue
            if (!playPauseButton.classList.contains('paused')){
                 video.pause()
                 playPauseButton.classList.toggle('paused')
             } 
        }

        if (e.target == trimRightBtn){
            console.log('moving')
            trimRightBtn.style.setProperty('--bound',percentage)
            trimLeftBtn.style.setProperty('--dist',leftWidth)
        }
    };
  
    totalTimeline.onpointerup = function(e) {
        let sqr = totalTimeline.getBoundingClientRect()
        const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
        let rightSqr = trimRightBtn.getBoundingClientRect()
        let leftSqr = trimLeftBtn.getBoundingClientRect()
        let leftWidth = `${rightSqr.x - leftSqr.x}px`
        trimLeftBtn.style.setProperty('--dist',leftWidth)


        if  (e.target == trackButton & !trackButton.hasAttribute('hidden')){
            if (video.paused) {video.play()
                playPauseButton.classList.toggle('paused')
                video.currentTime = percentage * video.duration
            }
        }

        if(e.target==trimLeftBtn & !trimLeftBtn.hasAttribute('hidden')){
            console.log('left out')

        }

        if(e.target==trimRightBtn & !trimRightBtn.hasAttribute('hidden')){
            console.log('right out')
        
        }
      totalTimeline.onpointermove = null;
      trackButton.onpointerup = null;
    };
}

playPauseButton.addEventListener('click',e=>{
    if (videoinput!=0){
        playPauseButton.classList.toggle('paused')
        if (!playPauseButton.classList.contains('paused')){
            video.play()
        } else {
            video.pause()
        }
    }
})

trimBtn.addEventListener('click', e=>{
    if (document.querySelector('.control-container').classList.contains('active')){
    
    trimRightBtn.style.setProperty('--bound',1)
    currentTimeline.classList.toggle('timeline')
    trackButton.toggleAttribute('hidden')
    trimLeftBtn.toggleAttribute('hidden')
    trimRightBtn.toggleAttribute('hidden')
    let rightSqr = trimRightBtn.getBoundingClientRect()
    let leftSqr = trimLeftBtn.getBoundingClientRect()
    let leftWidth = `${rightSqr.x - leftSqr.x}px`
    trimLeftBtn.style.setProperty('--dist',leftWidth)}
   
})

clearBtn.onclick= () =>{
    handler2()
}



function logTime(value){
    const format = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})
    const seconds = Math.floor(value % 60)
    const minutes = Math.floor(value/60)
    const hours = Math.floor(value/3600)
    
    if (hours == 0) {return `${minutes}:${format.format(seconds)}`}
    else {return `${hours}:${format.format(minutes)}:${format.format(seconds)}`}
}

function handleCutter(){
    let blob = new Blob([])
    let file = videoinput.files[0]

        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload=()=>{
            let result = reader.result
            let view = new DataView(result)
            
            let binary = new Uint8Array(result) 
            //maybe were supposed to use Uint64Array here to convert the data to base64
            radix = binary.slice(9999,11998)               
            console.log(radix)
            const blob = new Blob(radix)
            console.log(blob)
            document.querySelector("video").src = blob
        }
        const stream =new MediaRecorder()
        
}

function handler2(){
    let blob = new Blob([])
    let file = videoinput.files[0]

    const recorder = new MediaRecorder()

    // for (i=video.currentTime; i<video.duration; i++){
    //     console.log(i)
    // }
}
 