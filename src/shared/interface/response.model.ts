export interface ResponseModel<T> {
    statusCode: number;
    message?: string;
    data?: T;
}

// export interface ResponseModel {
//     statusCode: number;
//     message: string;
//     error?: string;
//     data?: any;
// }