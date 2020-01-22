export interface UserInterface {
    _id: string;
    accountId: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    friends?: UserInterface[];
}

// export interface UserInterface {
//     accountId: string;
//     username: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     friends?: UserInterface[];
//     invitations?: UserInterface[];
//     confirmation?: UserInterface[];
// }
