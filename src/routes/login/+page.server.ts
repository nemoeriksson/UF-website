import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


export const actions: Actions = {
    login: async({request, cookies})=>{
        return fail(401, {email_login: '[placeholder]', pw_login: '[placeholder]'});
    },
    register: async({request})=>{
        return fail(401, {email_reg: '[placeholder]', pw_reg: '[placeholder]'});
    }
};