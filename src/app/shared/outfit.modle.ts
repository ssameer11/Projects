export class Outfit {
    // image: string;
    // title: string;
    // price: number;
    // data: [string,string][];
    // category: string;
    // stockCount: number;
    // rating: number;
    constructor(public imageUrl: string,
                public title: string,
                public description: string,
                public price: number,
                public category: string,
                public stockCount: number,
                public rating: number,
                public instructions: [string,string][],
                public _id?: string,
                public creator?: {_id: string}) {

    }
}

export interface ICartItem {
    _id: string,
    outfit: Outfit,
    count: number
}