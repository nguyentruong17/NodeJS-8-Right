import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { BundleBookDto } from "./bundle-book.dto";

export class CreateBundleDto {

    @IsString()
    @Transform(({ value }) => value.trim(), { toClassOnly: true })
    @IsNotEmpty()
    name: string;
    
    @IsArray()
    @IsNotEmpty()
    books: Array<BundleBookDto>;
}