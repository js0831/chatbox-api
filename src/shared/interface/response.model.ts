export interface ResponseModel {
    statusCode: number;
    message: string;
    error?: string;
    data?: any;
}