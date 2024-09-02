import {roles} from '../../middleware/auth.js';

export const endPoint = {
    create:[roles.User,roles.Admin],
    remove:[roles.User],
    clear:[roles.User],
    get:[roles.User]
}