
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
const currentTimeline = document.querySelector('.timeline')

const counting = document.querySelector('.current-time')


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
        currentPos = percent
    }
    video.onended = ()=> {
        playPauseButton.classList.add('paused')
    }
})

totalTimeline.addEventListener('mousemove', updateTimeline)

function updateTimeline(e){
   let sqr = totalTimeline.getBoundingClientRect()
   const percentage = Math.min(Math.max(0, e.x -sqr.x),sqr.width)/sqr.width
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

function logTime(value){
    const format = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})
    const seconds = Math.floor(value % 60)
    const minutes = Math.floor(value/60)
    const hours = Math.floor(value/3600)
    
    if (hours == 0) {return `${minutes}:${format.format(seconds)}`}
    else {return `${hours}:${format.format(minutes)}:${format.format(seconds)}`}
}

