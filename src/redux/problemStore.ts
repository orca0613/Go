import { createStore, Store, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Add middleware if needed
import { problemReducer } from './problemReducer';
import { ProblemActionType } from './problemActionType';

type RootState = ReturnType<typeof problemReducer>;

const problemStore: Store<RootState, ProblemActionType> = createStore(problemReducer, applyMiddleware(thunk));

export default problemStore;