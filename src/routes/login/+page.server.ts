import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as crypto from 'crypto';
import { prisma } from '$lib';

// TODO - Cookies not saving

function hash(original:string, ){
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.pbkdf2Sync(original, salt, 1000, 64, 'sha256').toString('base64');
    return {salt,hash};
}

function validate(original:string, salt:string, storedHash:string){
    const hash = crypto.pbkdf2Sync(original, salt, 1000, 64, 'sha256').toString('base64');
    return hash == storedHash;
}

const defaultSettings = {
    // TODO - Set default settings
}

export const load = (async ({cookies}) => {
    let loggedin = cookies.get('loggedin');
    if(typeof loggedin !== 'undefined'){
        if(loggedin == 'true')
            throw redirect(302, '/user');
    }
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async({request, cookies})=>{
        let data = await request.formData();
        let email = data.get('email')?.toString().toLowerCase()!;
        let password = data.get('password')?.toString()!;
        let rememberDevice_str = data.get('remember')?.toString();
        let rememberDevice = rememberDevice_str == 'on';

        const existingUser = await prisma.user.findUnique({where: {
            email: email
        }});

        if(!existingUser)
            return fail(409, {email_login: 'Email not registered'});

        if(validate(password, existingUser.salt, existingUser.password)){
            if(rememberDevice){
                let expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate()+30);
                cookies.set('loggedin', 'true', {path:'/', secure:false, expires:expirationDate});
            }else{
                cookies.set('loggedin', 'true', {path:'/', secure:false});
            }
        }else
            return fail(403, {pw_login: 'Incorrent login data'});
        
        
        throw redirect(302, '/user');
    },

    register: async({request})=>{
        let data = await request.formData();
        let email = data.get('email')?.toString().toLowerCase()!;
        let password = data.get('password')?.toString()!;

        let validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        let hasLength = password.length>=8;
        let hasUppercase = /[A-Z]/.test(password);
        let hasNumber = /[0-9]/.test(password);

        const existingUser = await prisma.user.findUnique({where: {
            email: email
        }});

        if(!validEmail || !hasLength || !hasUppercase || !hasNumber || existingUser){
            let emailResponse = existingUser ? 'Email already in use' : !validEmail ? 'Invalid email format' : '';
            let pwResponse = !hasLength ? 'Password too short' : !hasUppercase ? 'Missing uppercase letters' : !hasNumber ? 'Must include a number' : '';
            return fail(406, {email_reg: emailResponse, pw_reg: pwResponse});
        }

        let hashData = hash(password);
        await prisma.user.create({data: {
            email: email,
            password: hashData.hash,
            salt: hashData.salt,
            settings: JSON.stringify(defaultSettings),
        }});

        return fail(401, {login_required: 'true'}); 
    }
};