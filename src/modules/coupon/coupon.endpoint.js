import {roles} from '../../middleware/auth.js';

export const endPoint = {
   
    create:[roles.User],
    getAlls:[roles.User],
    getActive:[roles.User],
    update:[roles.User],
    specific:[roles.Admin,roles.User]
}