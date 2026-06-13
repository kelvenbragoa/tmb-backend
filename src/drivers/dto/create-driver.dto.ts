import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDriverDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    mobile?: string;

    @IsString()
    @IsOptional()
    document?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    documentExpiryDate?: Date;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
