import {roles} from '../../middleware/auth.js';

export const endPoint = {
    create:[roles.Admin],
    getAlls:[roles.Admin],
    update:[roles.Admin],
    delete:[roles.Admin],
}