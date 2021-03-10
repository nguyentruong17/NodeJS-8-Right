import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BundleBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    id: number;
}