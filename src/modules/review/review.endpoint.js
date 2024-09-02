import {roles} from '../../middleware/auth.js';

export const endPoint = {
    create:[roles.Admin,roles.User],
    getAlls:[roles.Admin],
    getActive:[roles.User],
    update:[roles.Admin],
    specific:[roles.Admin,roles.User]
}