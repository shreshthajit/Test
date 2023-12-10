import { createSlice } from '@reduxjs/toolkit';


const gernalSlice = createSlice({
    name: 'gernal',
    initialState: {
        loader: false,
        providerDetails: {
            first_name: "",
            last_name: "",
            bio: "",
            description: "",
            email: "",
            password: "",
            file: "",
            specialities: [],
            education: [],
            experience: []
        },
        completeUser: {}
    },
    reducers: {
        setLoader: (state, action) => {
            state.loader = action.payload;
        },
        setUserDetails: (state, action) => {
            state.completeUser = action.payload;
        },
        setProviderDetails: (state, action) => {
            state.providerDetails = action.payload
        },
    },
});

export const { setLoader, setProviderDetails, setUserDetails } = gernalSlice.actions;
export const gernalReducer = gernalSlice.reducer;