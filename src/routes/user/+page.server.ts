import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({cookies}) => {
    let loggedinCookie = cookies.get('loggedin');
    if(typeof loggedinCookie === 'undefined' || loggedinCookie != 'true'){
        throw redirect(302, '/login');
    }


    return {};
}) satisfies PageServerLoad;