import { createStore, Store, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Add middleware if needed
import { userReducer } from '../redux/userReducer';
import { UserActionType } from '../redux/userActionTypes';

type RootState = ReturnType<typeof userReducer>;

const userStore: Store<RootState, UserActionType> = createStore(userReducer, applyMiddleware(thunk));

export default userStore;