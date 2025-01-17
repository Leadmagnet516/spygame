import { useContext, useState } from 'react';
import { ThemeContext } from '../contexts.js';
import { THEMES } from '../CONSTANTS.js'

export default function Switch(props) {
    const theme = useContext(ThemeContext);
    const [ on, setOn ] = useState(false)

    function onClick() {
        setOn(!on);
        props.onClick();
    }

    return (
        <div className={`abl-switch ${theme} ${on ? 'on' : ''}`} onClick={onClick}>
            <div className='abl-switch-inner'></div>
        </div>
    )
}