/** @format */

import { createSlice } from '@reduxjs/toolkit';

export interface AuthModel {
	_id: string;
	email: string;
	name: string;
	role: string;
	accessToken: string;
	refreshToken: string;
	isTwoFactorEnabled?: boolean;
}

export interface AuthState {
	authData: AuthModel | null;
}
export interface AuthAction {
	type: string;
	payload: AuthModel;
}

const initialState: AuthState = {
	authData: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		addAuth: (state, action) => {
			state.authData = action.payload;
		},
		removeAuth: (state, _action) => {
			state.authData = null;
		},
		updateAuth: (state, action) => {
			const { authData }: { authData: AuthModel | null } = state;
			if (authData) {
				const newAuthData = {
					...authData,
					...action.payload,
				};
				state.authData = newAuthData;
			}
		},
	},
});

export const { addAuth, removeAuth, updateAuth } = authSlice.actions;
export const authSelector = (state: any) => state.auth.authData;

export const authReducer = authSlice.reducer;
