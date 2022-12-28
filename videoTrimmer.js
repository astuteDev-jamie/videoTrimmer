
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
const LtrimText = document.getElementById('.left span')
const RtrimText = document.getElementById('.right span')
const slider = document.querySelector('.strip')
const thumb = document.querySelector('.thumb')

// trimLeftBtn.addEventListener('mousedown touchstart',)
videoinput.addEventListener('change',e=>{
    // h3.innerText=''
    CTA.style.display='none'
    let file = videoinput.files[0]
    document.querySelector('.control-container').classList.add('active')
    const blob = URL.createObjectURL(file)
    document.querySelector("video").src = blob
    //time display
    video.onloadeddata = ()=> {
        reading.textContent= logTime(video.currentTime)
        duration.textContent= logTime(video.duration)
    }
    video.ontimeupdate= (e)=> {
        reading.textContent= logTime(video.currentTime)
        const percent = video.currentTime/video.duration
        trackButton.style.setProperty('--currentPosition',percent)
        currentTimeline.style.setProperty('--currentPos',percent)
    }
    video.onended = ()=> {
        playPauseButton.classList.add('paused')
    }
})

// totalTimeline.addEventListener('pointermove', updateTimeline)
totalTimeline.addEventListener('pointerdown', changeScrubbing)
// document.addEventListener('pointereup', e=> {
//     updateTimeline(e)
//     let sqr = totalTimeline.getBoundingClientRect()
//     const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
//     let rightSqr = trimRightBtn.getBoundingClientRect()
//     let leftSqr = trimLeftBtn.getBoundingClientRect()
//     let leftWidth = `${rightSqr.x - leftSqr.x}px`
//     trimLeftBtn.style.setProperty('--dist',leftWidth)

//     if (scrubbing) {
//     scrubbing = !scrubbing
//         if (video.paused) video.play()
//         playPauseButton.classList.toggle('paused')
//         video.currentTime = percentage * video.duration
//     }
//     if (lBound){
//         lBound= !lBound
//     }
//     if (rBound){
//         rBound = !rBound
//     }
// })

// document.addEventListener('pointermove', e=> {
//     e.preventDefault()
//     if (scrubbing || lBound || rBound) updateTimeline(e)

// })

let lBound =false
let rBound =false
let scrubbing = false


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
    }
  
    totalTimeline.onpointermove = function(e) {
        let sqr = totalTimeline.getBoundingClientRect()
        let rightSqr = trimRightBtn.getBoundingClientRect()
        let leftSqr = trimLeftBtn.getBoundingClientRect()
        const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
        const leftWidth = `${rightSqr.x - leftSqr.x}px`
        currentTimeline.style.setProperty('--preview',percentage)

        if (e.target == trackButton){
            trackButton.style.setProperty('--currentPosition',percentage)
            currentTimeline.style.setProperty('--currentPos',percentage)
        }

        if (e.target ==  trimLeftBtn){
            console.log(e.pointerId)
            trimLeftBtn.style.setProperty('--bound',percentage)
            trimLeftBtn.style.setProperty('--dist',leftWidth)
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

function updateTimeline(e){
   let sqr = totalTimeline.getBoundingClientRect()
   let rightSqr = trimRightBtn.getBoundingClientRect()
   let leftSqr = trimLeftBtn.getBoundingClientRect()
   const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
   const leftWidth = `${rightSqr.x - leftSqr.x}px`
   currentTimeline.style.setProperty('--preview',percentage)

   if (scrubbing){
    currentTimeline.style.setProperty('--currentPos',percentage)
    trackButton.style.setProperty('--currentPosition',percentage)
   }

   if (lBound ){
       trimLeftBtn.style.setProperty('--bound',percentage)
       trimLeftBtn.style.setProperty('--dist',leftWidth)
   }
   if (rBound ){
    trimRightBtn.style.setProperty('--bound',percentage)
    trimLeftBtn.style.setProperty('--dist',leftWidth)
   }
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
        console.log('smelling')
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

function setLRtrim(){

}

function logTime(value){
    const format = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})
    const seconds = Math.floor(value % 60)
    const minutes = Math.floor(value/60)
    const hours = Math.floor(value/3600)
    
    if (hours == 0) {return `${minutes}:${format.format(seconds)}`}
    else {return `${hours}:${format.format(minutes)}:${format.format(seconds)}`}
}

thumb.onpointerdown = function(e) {
    console.log(e.pointerId)
    let sqr = slider.getBoundingClientRect()
    thumb.setPointerCapture(e.pointerId);
    
    thumb.onpointermove = function(e) {
        console.log(e.pointerId)
      let newLeft = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
      thumb.style.setProperty('--currentPosition',newLeft)
    };
  
    thumb.onpointerup = function(e) {
      thumb.onpointermove = null;
      thumb.onpointerup = null;
    };
  };