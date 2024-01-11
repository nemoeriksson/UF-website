import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib';

/**
 * This function is responsible for checking the user's session by reading the session key from cookies and querying the 
 * database for the user associated with that session.
 * If the session is valid, it allows the user to access the requested page; otherwise, it redirects them to the '/login' page.
 *
 * @param params - The context containing the cookies and other data.
 * @throws {Redirect} If the user is not authenticated (no valid session), they are redirected to the '/login' page.
 * @returns An object containing the page's properties or an empty object.
 */
export const load = (async ({cookies}) => {
    const tokenID = cookies.get('token');
    let isLoggedIn = false;
    let user_;
    let devices:any|undefined;

    if(tokenID){
        const token = await prisma.token.findUnique({
            where: {
                id: tokenID
            },
            include: {
                user: true
            }
        });
        user_ = token?.user;
        const user = await prisma.user.findUnique({
            where: {
                id: user_?.id
            },
            include: {
                devices: true
            }
        });
        devices = user?.devices;
        isLoggedIn = token ? true : false;
    }

    if(!isLoggedIn){
        throw redirect(302, '/login');
    }

    return { email: user_?.email, devices };
}) satisfies PageServerLoad;