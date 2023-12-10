import { GoogleLogin } from '@react-oauth/google';
import React from 'react'

const Google = () => {
    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    )
}

export default Google