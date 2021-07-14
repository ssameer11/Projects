import { BACKEND_URL } from "../auth/api_keys";

export const  parseUrl = (url: string): string => {
    const urlParts = url.split('/');
    const generatedPath = `${BACKEND_URL}/static/${urlParts[urlParts.length-1]}`;
    return generatedPath;
}

const pObject = {};

export function parseQueryParams(data: {[key: string]: any},destObject: {[key: string]: any}) {
    for(let k of Object.keys(data)) {
        destObject[k] = data[k].toString();
    }
}

export const categories = ['None','MALE','MALE TOP','MALE BOTTOM','FEMALE','FEMALE TOP','FEMALE BOTTOM'];

export enum lsNames {
    CUSTOMER = 'customerPageData',
    SELLER = 'sellerPageData'
}