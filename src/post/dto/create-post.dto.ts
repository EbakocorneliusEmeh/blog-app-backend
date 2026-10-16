// import { 
//   IsString, 
//   IsNotEmpty, 
//   IsOptional, 
//   IsEnum, 
//   IsUrl, 
//   MinLength, 
//   MaxLength, 
//   IsArray 
// } from 'class-validator';
// import { Transform } from 'class-transformer';

// export class CreatePostDto {
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(3)
//   @MaxLength(200)
//   title: string;

//   @IsString()
//   @IsOptional()
//   @Transform(({ value, obj }) => {

//     if (!value && obj.title) {
//       return obj.title
//         .toLowerCase()
//         .replace(/\s+/g, '-')
//         .replace(/[^a-z0-9-]/g, '');
//     }
//     return value?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//   })
//   slug?: string;

//   @IsString()
//   @IsNotEmpty()
//   @MinLength(10)
//   content: string;

  
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (value === undefined || value === null || value === '') {
//       return undefined;
//     }
//     return value;
//   })
//   @IsUrl({ require_protocol: true }, { 
//     message: 'Thumbnail must be a valid URL' 
//   })
//   thumbnail?: string;

// @IsOptional()
//   @IsString()
//   thumbnailPublicId?: string;

//   @IsOptional()
// @Transform(({ value }) =>
//   typeof value === 'string' && value.trim().length === 0
//     ? undefined
//     : value
// )
// @IsString()
// @MinLength(10)
// @MaxLength(500)
// excerpt?: string;


//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   tags?: string[];
//   @IsOptional()
// @IsArray()
// @IsString({ each: true })
// categories?: string[];


//   @IsOptional()
//   @IsString()
//   authorId?: string; 

//   @IsOptional()
//   @IsString()
//   @MinLength(20)
//   @MaxLength(160)
//   seoDescription?: string;

//   @IsOptional()
//   @IsEnum(['draft', 'published'])
//   status?: 'draft' | 'published' = 'published';
// }

import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  MinLength, 
  MaxLength, 
  IsArray,
  IsNumber, 
  Validate
} from 'class-validator';
import { Transform } from 'class-transformer';
import { isURL } from 'class-validator';

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Custom validator: URL or gallery filename
@ValidatorConstraint({ name: 'IsUrlOrGallery', async: false })
class IsUrlOrGallery implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true; // optional
    if (typeof value !== 'string') return false;

    // Allow full URL
    if (isURL(value, { require_protocol: true })) return true;

    // Allow "gallery selection" — simple filename pattern
    const galleryPattern = /^[\w-]+\.(jpg|jpeg|png|webp)$/i;
    if (galleryPattern.test(value)) return true;

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Thumbnail must be a valid URL or a gallery image filename';
  }
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @Transform(({ value, obj }) => {

    if (!value && obj.title) {
      return obj.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    return value?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  })
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  
  @IsOptional()
  @Validate(IsUrlOrGallery)
  thumbnail?: string;

@IsOptional()
  @IsString()
  thumbnailPublicId?: string;

  @IsOptional()
@Transform(({ value }) =>
  typeof value === 'string' && value.trim().length === 0
    ? undefined
    : value
)
@IsString()
@MinLength(10)
@MaxLength(500)
excerpt?: string;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  authorId?: string;


  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(160)
  seoDescription?: string;

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published' = 'published';
}