import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducer/index";
import { flashGangMiddleware } from "../middleware";
const store = createStore(
    rootReducer,
    applyMiddleware(flashGangMiddleware));
export default store;