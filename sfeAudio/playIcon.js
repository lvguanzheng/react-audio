import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.less'

class PlayIcon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {
            playState,
            controlClick,
        } = this.props
        return (
            <div className={styles[`icon-${playState}`]} onClick={() => {controlClick()}}>
                {
                    playState === 'load' &&
                    <div className={styles['load-triangle']} />
                }
                {
                    playState === 'pause' &&
                    <div className={styles['pause-triangle']} />
                }
                {
                    playState === 'playing' &&
                    <div className={styles['playing-line']} />
                }
            </div>
        )
    }
}

PlayIcon.propTypes = {
    playState: PropTypes.string,
    controlClick: PropTypes.func,
}

PlayIcon.defaultProps = {
    playState: 'playing',
    controlClick: () => {},
}

export default PlayIcon
