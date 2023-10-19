import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as crypto from 'crypto';
import { prisma } from '$lib';

/**
 * Generates a salt and hash for a given string using PBKDF2 key derivation.
 *
 * @param original - The original string to hash.
 * @returns An object containing the generated salt and hash.
 * @throws {Error} If any error occurs during the hashing process.
 */
function hash(original:string, ) : {salt:string, hash:string}{
    // Generate a random salt and compute the hash using PBKDF2
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.pbkdf2Sync(original, salt, 1000, 64, 'sha256').toString('base64');
    
    return {salt,hash};
}

/**
 * Validates a string by comparing its hash with a stored hash using the provided salt and PBKDF2 key derivation.
 *
 * @param original      - The original string to validate.
 * @param salt          - The salt used for hashing the original string.
 * @param storedHash    - The stored hash to compare against.
 * @returns `true` if the original string's hash matches the stored hash, `false` otherwise.
 */
function validate(original:string, salt:string, storedHash:string) : boolean{
    // Compute the hash for the provided string and salt
    const hash = crypto.pbkdf2Sync(original, salt, 1000, 64, 'sha256').toString('base64');
    return hash == storedHash;
}

const defaultSettings = {
    // TODO - Set default settings
}

/**
 * This function is executed on the server when rendering a page or route and handles user session and redirection logic.
 *
 * @param params - The context containing the cookies.
 * @throws {Redirect} If a redirection is required based on the user's session status.
 * @returns An object containing the page's properties that will be passed to `+page.svelte` rendering.
 */
export const load = (async ({cookies}) => {
    let sessionKey = cookies.get('session');
    const user = await prisma.user.findUnique({where: {
        session: sessionKey
    }});

    if(typeof sessionKey !== 'undefined' && user?.session){
        throw redirect(302, '/user');
    }
    
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    /**
     * Login function for handling user authentication and session management.
     * This function is responsible for processing user login data, validating credentials, and managing user sessions.
     *
     * @param params - The context containing the request, cookies, and other data.
     * @throws {Redirect} If the login is successful, the user is redirected to the '/user' page. If the login fails, it may return an error response.
     * @returns An object with error details if any of the login credentials are incorrect or invalid
     */
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
                expirationDate.setDate(expirationDate.getDate()+14);
                cookies.set('session', existingUser.session, {path:'/', secure:false, expires:expirationDate});
            } 
            
            else{
                cookies.set('session', existingUser.session, {path:'/', secure:false});
            }
        } 

        else{
            return fail(403, {pw_login: 'Incorrent login data'});
        }

        throw redirect(302, '/user');
    },

    /**
     * This function processes user registration data, validates the input, checks for existing users, and creates a new user account.
     *
     * @param params - The context containing the request and other data.
     * @returns An object will error details if some of the inputted data is invalid. A fail will also be returned on a 
     *          successfull registration that requires the user to login direclty afterwards
     */
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
            session: crypto.randomBytes(16).toString('base64'),
            email: email,
            password: hashData.hash,
            salt: hashData.salt,
            settings: JSON.stringify(defaultSettings),
        }});

        // Returns fail with data for the client to know that they have to log in to continue
        return fail(401, {login_required: 'true'}); 
    }
};