import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
        .then(result => {
            const FBIToken = `Bearer ${result.data.token}`;

            localStorage.setItem('FBToken', FBIToken);
            axios.defaults.headers.common['Authorization'] = FBIToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(error => {
            console.error(error);
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            });
        });
}

export const getUserData = () => (dispacth) => {
    axios.get('/user')
        .then(response => {
            dispacth({
                type: SET_USER,
                payload: response.data
            });
        })
        .catch(error => {
            console.error(error);
        });
}