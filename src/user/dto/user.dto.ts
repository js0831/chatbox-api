import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {

    @IsNotEmpty()
    readonly accountId: string;

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly firstname: string;

    @IsNotEmpty()
    readonly lastname: string;

    @IsEmail()
    readonly email: string;
}
