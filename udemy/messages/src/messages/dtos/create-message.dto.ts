import { IsString } from 'class-validator';

/**
 * Validation using Pipes
 * 1. add ValidationPipe to the main.ts file (`app.useGlobalPipes(new ValidationPipe());`)
 * 2. Create DTO (Data Transfer Object) class for the request body
 * 3. Add validation rules to the class (using class-validator)
 * 4. Apply the class to the request handler which is a controller (using class-transformer)
 *
 * Process of ValidationPipe
 * 1. Take the incoming request data
 * 2. Turn the body into an instance of the DTO class using `class-transformer`
 * 3. Validate the instance using `class-validator`
 * 4. If the validation fails, it will throw an error
 * 5. If the validation passes, it will pass the instance to the request handler
 *
 * @see https://github.com/typestack/class-validator
 * @see https://github.com/typestack/class-transformer
 */
export class CreateMessageDto {
  @IsString()
  content: string;
}
