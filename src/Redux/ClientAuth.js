// ClientAuth.js
import { createSlice } from "@reduxjs/toolkit";

export const ClientAuth = createSlice({
  name: 'Client',
  initialState: {
    Token: null,
    Id: null,
  },
  reducers: {
    ClientLogin(state, action) {
      state.Token = action.payload.token;
    },
    ClientLogout(state, action) {
      state.Token = '';
    },
    ClientId(state, action) {
      state.Id = action.payload.id;
    },
  },
});

export const { ClientLogin, ClientLogout, ClientId } = ClientAuth.actions;
export default ClientAuth.reducer;
