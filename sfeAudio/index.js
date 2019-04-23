import React from 'react'
import PropTypes from 'prop-types'

import style from './index.less'
import PlayIcon from './playIcon'
import SOUND_ICON from './images/sound_icon.png'
import NO_SOUND_ICON from './images/no_sound_icon.png'

class SfeAudio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlay: false,
            isSound: true,
            max: 0,
            totalTime: '0:00',
            currentTime: '0:00',
            isLoad: false,
        }
        this.audio = new Audio()
        this.startMove = false
        this.progress = null
    }

    componentDidMount() {
        this.audio = this.currentAudio
        this.progress = this.currentProgress
        this.audio.addEventListener('loadedmetadata', () => {
            const { duration } = this.audio
            const time = this.transTime(duration)
            this.setState({
                totalTime: time,
                max: duration,
                isLoad: true,
            })
        })
        this.audio.addEventListener('timeupdate', this.updateProgress)
        this.audio.addEventListener('ended', this.playEnd)
        this.progress.addEventListener('mousedown', e => {
            const { isPlay } = this.state
            this.startMove = true
            const progressWidth = this.progress.offsetWidth
            const currentValue = (e.offsetX / progressWidth) * this.audio.duration
            this.changeBgColor(currentValue)
            if (isPlay) {
                this.audio.pause()
                this.audio.removeEventListener('timeupdate', this.updateProgress)
            }
        })
        this.progress.addEventListener('mousemove', e => {
            if (this.startMove) {
                this.setState({
                    currentTime: this.transTime(e.target.value),
                }, () => {
                    this.changeBgColor(e.target.value)
                })
            }
        })
        this.progress.addEventListener('mouseup', e => {
            this.startMove = false
            this.setState({
                currentTime: this.transTime(e.target.value),
            }, () => {
                this.audio.currentTime = e.target.value
                this.audio.addEventListener('timeupdate', this.updateProgress)
            })
        })
    }

    changeBgColor = currentValue => {
        const rate = (currentValue * 100) / this.audio.duration
        this.progress.style.background = `linear-gradient(to right, #3D8DEA, #6EBFF6 ${rate}%, #D2E7FF ${rate}%)`
    }

    updateProgress = () => {
        const { currentTime, ended } = this.audio
        const { isPlay } = this.state
        this.setState({
            currentTime: this.transTime(currentTime),
        }, () => {
            this.progress.value = currentTime
            this.changeBgColor(currentTime)
            if (isPlay && !ended) {
                this.audio.play()
            }
        })
    }

    playStateChange = () => {
        const { isPlay } = this.state
        const { onPlayCb } = this.props
        this.setState({
            isPlay: !isPlay,
        }, () => {
            if (isPlay) {
                this.audio.pause()
            } else {
                this.audio.play()
                onPlayCb()
            }
        })
    }

    soundStateChange = () => {
        const { isSound } = this.state
        this.setState({
            isSound: !isSound,
        }, () => {
            this.audio.muted = !this.audio.muted
        })
    }

    playEnd = () => {
        this.progress.value = 0
        this.changeBgColor(0)
        this.setState({
            currentTime: '0:00',
            isPlay: false,
        })
    }

    formatTime = value => {
        let time = ''
        const timeArr = value.split(':')
        const timeArrLength = timeArr.length
        timeArr.forEach((item, index) => {
            if (index < timeArrLength - 1) {
                time += item.lenght === 1 ? `0${item}` : item
                time += ':'
            }
        })
        time += timeArr[timeArrLength - 1].length === 1 ? `0${timeArr[timeArrLength - 1]}` : timeArr[timeArrLength - 1]
        return time
    }

    transTime = value => {
        let time = ''
        const h = parseInt(value / 3600, 10)
        value %= 3600
        const m = parseInt(value / 60, 10)
        const s = parseInt(value % 60, 10)
        if (h > 0) {
            time = this.formatTime(`${h}:${m}:${s}`)
        } else {
            time = this.formatTime(`${m}:${s}`)
        }
        return time
    }

    render() {
        const {
            isPlay,
            isSound,
            max,
            totalTime,
            currentTime,
            isLoad,
        } = this.state
        const {
            src,
        } = this.props
        return (
            <div>
                <audio src={src} ref={c => { this.currentAudio = c }} id={`${src}-audio-id`} />
                <div className={style['new-audio']}>
                    {
                        !isLoad &&
                        <PlayIcon id={`${src}-audio-load`} playState="load" />
                    }
                    {
                        isLoad &&
                        <PlayIcon
                            id={`${src}-audio-loaded`}
                            playState={!isPlay ? 'pause' : 'playing'} 
                            controlClick={this.playStateChange}
                        />
                    }
                    <div className={style['new-audio-time']}>
                        <span className={style['current-time']}>{currentTime}</span>
                        <span>/</span>
                        <span>{totalTime}</span>
                    </div>
                    <input
                        type="range"
                        ref={c => { this.currentProgress = c }}
                        className={style['audio-progress']}
                        max={max}
                        min={0}
                    />
                    <img
                        src={isSound ? SOUND_ICON : NO_SOUND_ICON}
                        alt=""
                        onClick={this.soundStateChange}
                        className={isSound ? style['sound-control-icon'] : style['no-sound-icon']}
                    />
                </div>
            </div>
        )
    }
}

SfeAudio.propTypes = {
    src: PropTypes.string,
    onPlayCb: PropTypes.func,
}

SfeAudio.defaultProps = {
    src: 'http://www.ytmp3.cn/down/57297.mp3',
    onPlayCb: () => {},
}

export default SfeAudio
