import { useState, useEffect} from 'react/cjs/react.development';
import './charList.scss';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const CharList = (props) => {

    const [char, setChar] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)
    
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharLoaded)
    }


    const onCharLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }

        setChar((charList) => [...char, ...newCharList])
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading ? <Spinner/> : null

    const li = char.map(({name, thumbnail, id}) => {
        let flexImg = {'objectFit' : 'cover'}
        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') { 
            flexImg = {'objectFit' : 'contain'}
        }

    const active = props.charId === id
    const clazz = active ? 'char__item char__item_selected' : 'char__item'

        return(
            <li
            tabIndex={0}
            key={id}
            onFocus={() => props.onCharSelected(id)}
            className={clazz}
            >
                <img src={thumbnail} style={flexImg} alt="img"/>
                <div className="char__name">{name}</div>
            </li>
        )
    })

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            <ul className="char__grid">
            {li}
            </ul>
            <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



export default CharList;