import { ActionReducer } from '@ngrx/store'
import { IBalance } from '../../shared/balances.model'
import { BalancesActions, BalancesActionTypes } from '../actions/balances.action'

export interface State {
	selectedBalanceSymbol: string
	entities?: IBalance[]
	loading: boolean
	error: string
}

const initialBalancesState: State = {
	selectedBalanceSymbol: '',
	entities: [],
	loading: false,
	error: ''
}

export const reducer: ActionReducer<State> = (state = initialBalancesState, action: BalancesActions): State => {
	switch (action.type) {
		case BalancesActionTypes.LOAD: {
			return {
				...state,
				loading: true
			}
		}

		case BalancesActionTypes.LOAD_FAIL: {
			return {
				...state,
				error: action.payload
			}
		}

		case BalancesActionTypes.LOAD_SUCCESS: {
			return {
				...state,
				entities: action.payload,
				loading: false
			}
		}

		case BalancesActionTypes.SELECT: {
			return {
				...state,
				selectedBalanceSymbol: action.payload
			}
		}

		default:
			return state
	}
}
