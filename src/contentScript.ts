const getVideoElements = () => document.querySelectorAll('video')
const getEnabledMediaButtons = () => {
  const buttonSelector = '[role=button]'
  const enabledMediaSelector = '[data-is-muted=false]'
  return document.querySelectorAll<HTMLElement>(`${buttonSelector}${enabledMediaSelector}`)
}

const extractMediaStreamsFromVideo = (videoElements: NodeListOf<HTMLVideoElement>) => {
  return Array.from(videoElements)
    .map(videoElement => videoElement.srcObject)
    .filter(srcObject => !!srcObject) as MediaStream[]
}
const doesActiveMediaStreamExist = (mediaStreams: MediaStream[]) => {
  return mediaStreams.some(mediaStream => mediaStream.active)
}
const turnOffMedia = (videoElements: NodeListOf<HTMLVideoElement>) => {
  const mediaStreams = extractMediaStreamsFromVideo(videoElements)

  // turn off the media
  const enabledMediaButtons = getEnabledMediaButtons()
  enabledMediaButtons.forEach(button => button.click())

  // check if the camera is off
  if (doesActiveMediaStreamExist(mediaStreams)) alert(ERROR_MESSAGES.CAMERA_IS_ACTIVE)
}

const LOOP_LIMIT = 500
const LOOP_INTERVAL = 500
const ERROR_MESSAGES = {
  CAMERA_IS_ACTIVE: 'カメラをOFFにできていないかもしれません。この拡張を無効化した後リロードし、手動でカメラをOFFにしてください'
}

window.addEventListener('load', () => {
  let loopcount = 0
  const mainLoopId = setInterval(() => {
    loopcount++
    if (loopcount > LOOP_LIMIT) clearInterval(mainLoopId)

    // video要素がなかったら何もしない
    const videoElements = getVideoElements()
    if (!videoElements.length) return

    clearInterval(mainLoopId)
    turnOffMedia(videoElements)
  }, LOOP_INTERVAL)
})