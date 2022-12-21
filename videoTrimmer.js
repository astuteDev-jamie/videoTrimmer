
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


// trimLeftBtn.addEventListener('mousedown',)
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

totalTimeline.addEventListener('mousemove', updateTimeline)
totalTimeline.addEventListener('mousedown', changeScrubbing)
document.addEventListener('mouseup', e=> {
    let sqr = totalTimeline.getBoundingClientRect()
    const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
    updateTimeline(e)
    if (scrubbing) {
    scrubbing = !scrubbing
        if (video.paused) video.play()
        playPauseButton.classList.toggle('paused')
        video.currentTime = percentage * video.duration
    }
    if (lBound){
        lBound= !lBound
        
    }
    if (rBound){
        rBound = !rBound
    }
})

document.addEventListener('mousemove', e=> {
    if (scrubbing || lBound || rBound) updateTimeline(e)
})

let lBound =false
let rBound =false
let scrubbing = false
function changeScrubbing(e){
    let sqr = totalTimeline.getBoundingClientRect()
    const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
    if (e.buttons===1 & !trackButton.hasAttribute('hidden')){
        scrubbing = !scrubbing
        if (scrubbing){
            if (!playPauseButton.classList.contains('paused')){
                video.pause()
                playPauseButton.classList.toggle('paused')
            } 
        } 
        video.currentTime = percentage * video.duration
        // updateTimeline(e)
    } 
    if (e.buttons===1 & e.target==trimLeftBtn){
        lBound=!lBound
    }
    if (e.buttons===1 & e.target==trimRightBtn){
        rBound=!rBound
    }
}

function updateTimeline(e){
   let sqr = totalTimeline.getBoundingClientRect()
   let rightSqr = trimRightBtn.getBoundingClientRect()
   let leftSqr = trimLeftBtn.getBoundingClientRect()
   const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
   const leftWidth = `${rightSqr.x - leftSqr.x}px`
   currentTimeline.style.setProperty('--preview',percentage)

   if (scrubbing){
    e.preventDefault()
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

function resetTotaltime(){}

function logTime(value){
    const format = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})
    const seconds = Math.floor(value % 60)
    const minutes = Math.floor(value/60)
    const hours = Math.floor(value/3600)
    
    if (hours == 0) {return `${minutes}:${format.format(seconds)}`}
    else {return `${hours}:${format.format(minutes)}:${format.format(seconds)}`}
}

