import { useContext, useState } from 'react';
import { ThemeContext } from '../contexts.js';

export default function Menu(props) {
    const theme = useContext(ThemeContext);

    return (
        <ul className={`abl-menu ${theme}`}>
            {
                props.items.map((menuItem, index) => {
                    return (
                        <MenuItem item={menuItem} key={`menuItem${index}`} />
                    )
                })
            }
        </ul>
    )
}

export function MenuItem(props) {
    const [hover, setHover] = useState(false);

    const mouseOver = () => {
        setHover(true);
    }

    const mouseOut = () => {
        setHover(false);
    }

    return (
        <li className={`abl-menu-item ${hover ? 'hover' : ''}`} onMouseOver={mouseOver} onMouseOut={mouseOut} onClick={props.item.onClick}>{props.item.name}</li>
    )
}