import React from 'react';
import {MARIO, MUSHROOM} from './../constants'

const style = ({ size, cell }) => {
    const dim = size + 'px';
    let style = {
        width: dim,
        height: dim,
    };
    if(cell.value === 'mushroom'){
        style.backgroundImage = `url(${MUSHROOM})`;
    }
    if(cell.value === 'player') {
        style.backgroundImage = `url(${MARIO})`;
    }

    return style;
};

const classNames= (cell)=>{
    return ['cell', cell.value].join(' ')
}

export default (props) => <td className={classNames(props.cell)} style={style(props)}/>
